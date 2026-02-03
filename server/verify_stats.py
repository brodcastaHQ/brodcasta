import asyncio
import uuid
import httpx
import websockets
import json

BASE_URL = "http://localhost:7501"
WS_URL = "ws://localhost:7501"

async def verify_stats():
    async with httpx.AsyncClient() as client:
        # 1. Login to get token
        login_res = await client.post(f"{BASE_URL}/api/accounts/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        if login_res.status_code != 200:
            print("Login failed. Make sure a user exists.")
            # Try to create one if it fails
            await client.post(f"{BASE_URL}/api/accounts/signup", json={
                "email": "test@example.com",
                "password": "password123",
                "first_name": "Test",
                "last_name": "User"
            })
            login_res = await client.post(f"{BASE_URL}/api/accounts/login", json={
                "email": "test@example.com",
                "password": "password123"
            })
        
        token = login_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Create project
        project_res = await client.post(f"{BASE_URL}/api/projects/", headers=headers, json={
            "name": "Stats Test Project",
            "auth_type": "none"
        })
        project = project_res.json()
        project_id = project["id"]
        
        # 2b. Get secret (rotate if needed or just get it)
        secret_res = await client.get(f"{BASE_URL}/api/projects/{project_id}/secret", headers=headers)
        project_secret = secret_res.json()["project_secret"]

        print(f"Project ID: {project_id}, Secret: {project_secret}")

        # 3. Connect via WebSocket
        ws_uri = f"{WS_URL}/{project_id}?secret={project_secret}"
        async with websockets.connect(ws_uri) as ws:
            print("WS Connected")
            
            # 4. Connect via SSE (Long Poll)
            # In our system, SSE is handled via poll_connect
            # We'll use a side task for SSE to keep it open
            async def run_sse():
                try:
                    async with httpx.AsyncClient(timeout=None) as sse_client:
                        async with sse_client.stream("GET", f"{BASE_URL}/api/sse/{project_id}/connect?secret={project_secret}") as sse_res:
                            print("SSE Connected")
                            async for line in sse_res.aiter_lines():
                                if line:
                                    print(f"SSE: {line}")
                except Exception as e:
                    print(f"SSE Error: {e}")

            sse_task = asyncio.create_task(run_sse())
            await asyncio.sleep(2) # Wait for SSE to establish

            # 5. Call stats endpoint
            stats_res = await client.get(f"{BASE_URL}/api/projects/{project_id}/stats", headers=headers)
            stats = stats_res.json()
            print(f"Stats: {json.dumps(stats, indent=2)}")

            # Assertions (optional but good for logs)
            assert stats["total_connections"] >= 2
            assert stats["websocket_connections"] >= 1
            assert stats["sse_connections"] >= 1
            assert stats["rooms_count"] >= 1 # default room

            print("Verification successful!")
            sse_task.cancel()

if __name__ == "__main__":
    asyncio.run(verify_stats())
