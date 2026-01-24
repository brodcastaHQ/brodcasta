# Nexios Comprehensive Guide

This document provides a detailed overview of the Nexios framework, covering all key aspects and topics found in the documentation.

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Getting Started](#getting-started)
4. [Routing and Handlers](#routing-and-handlers)
5. [Middleware and Events](#middleware-and-events)
6. [Security and Authentication](#security-and-authentication)
7. [Advanced Features](#advanced-features)
8. [Advanced Routing with Groups and Routes](#advanced-routing-with-groups-and-routes)
9. [Custom Authentication Backends](#custom-authentication-backends)
10. [Advanced Authentication Patterns](#advanced-authentication-patterns)
11. [Advanced Dependency Injection](#advanced-dependency-injection)
12. [Deep Nexios Concepts](#deep-nexios-concepts)
13. [Advanced WebSocket Features](#advanced-websocket-features)
14. [Performance and Production](#performance-and-production)
15. [Testing and Best Practices](#testing-and-best-practices)

---

## Introduction

### What is Nexios?

Nexios is a high-performance, async-first Python web framework built on top of ASGI. It is designed for speed, flexibility, and simplicity, making it an excellent choice for modern web development.

**Key Features:**

- **High Performance ⚡**: Optimized core for fast performance, handling thousands of concurrent connections.
- **Async-First 🔄**: Native `async/await` support throughout, with no sync-to-async bridges.
- **Clean Architecture 🏗️**: Promotes dependency injection, separation of concerns, and testability.
- **Developer Friendly 📚**: Intuitive API, excellent tooling, and comprehensive type hints.
- **Production Ready 🏭**: Built-in security, monitoring hooks, and easy deployment.

### Why Choose Nexios?

- **True Async**: Unlike frameworks that add async as an afterthought, Nexios is built on ASGI from the ground up.
- **Modern**: Fully embraces Python 3.9+ features (type hints, dataclasses).
- **Flexible**: Modular architecture allows for easy extension and customization.

---

## Core Concepts

### ASGI Foundation

Nexios is built on the **Asynchronous Server Gateway Interface (ASGI)**, which enables handling multiple requests concurrently, WebSocket support, and HTTP/2.

### Framework Architecture

1. **ASGI Layer**: Handles low-level protocol details (Scope, Receive, Send).
2. **Middleware Layer**: Processes requests/responses globally (logging, CORS, Auth).
3. **Routing Layer**: Matches URL patterns to handlers.
4. **Handler Layer**: Contains business logic (your code).
5. **Response Layer**: Converts return values to HTTP responses.

### Request Lifecycle

1. **Request Reception**: ASGI server creates scope.
2. **Middleware Chain**: Pre-processing (auth, validation).
3. **Route Matching**: Router finds the handler.
4. **Dependency Injection**: Dependencies are resolved.
5. **Handler Execution**: Your async function runs.
6. **Response Processing**: Return value converted to response.
7. **Middleware Post-Processing**: Final modifications.
8. **Transmission**: Response sent to client.

---

## Getting Started

### Installation

Recommended installation using `uv`:

```bash
uv pip install nexios
```

Or with `pip`:

```bash
pip install nexios
```

### Your First Application

Create `main.py`:

```python
from nexios import NexiosApp
import uvicorn

app = NexiosApp()

@app.get("/")
async def home(request, response):
    return response.json({"message": "Hello from Nexios!"})

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
```

---

## Routing and Handlers

### Basic Routing

Nexios offers a flexible routing system using decorators or the `Route` class.

**Basic Routing:**

```python
from nexios import NexiosApp

@app.get("/")
async def index(request, response):
    return response.json({"message": "Hello"})
```

**Path Parameters:**

Support for typed path parameters with automatic validation:

```python
from nexios import NexiosApp

@app.get("/users/{user_id:int}")
async def get_user(request, response):
    # user_id is automatically converted to int
    uid = request.path_params.user_id
    return response.json({"id": uid})
```

*Available types:* `str`, `int`, `float`, `uuid`, `path`, `slug`.

### Router Groups and Nesting

Use `Router` to group related routes. You can assign prefixes, tags, and middleware to groups, and even nest routers within routers for complex API structures.

```python
from nexios.routing import Router
from nexios import NexiosApp

# Create a router for user-related endpoints
user_router = Router(prefix="/users", tags=["Users"])

@user_router.get("/")
async def list_users(req, res): ...

# Mount the main user router to the app
app.mount_router(user_router)
```

---

## Middleware and Events

### Middleware

Middleware acts as a pipeline to intercept, process, and modify requests and responses.

**Usage:**

```python
from nexios.middleware import BaseMiddleware

class CustomMiddleware(BaseMiddleware):
    async def process_request(self, req, res, next):
        # Pre-process
        await next()
    
    async def process_response(self, req, res):
        # Post-process
        return res

app.add_middleware(CustomMiddleware())
```

---

## Security and Authentication

### Authentication

Secure your API with the `@auth` decorator and robust middleware.

**Usage:**

```python
from nexios.auth.decorators import auth
from nexios import NexiosApp

@app.get("/profile")
@auth()
async def profile(req, res):
    return {"user": req.user.identity}
```

---

## Advanced Features

### Dependency Injection

Powerful DI system for clean architecture.

```python
from nexios import NexiosApp, Depend

def get_db():
    return Database()

@app.get("/")
async def index(req, res, db = Depend(get_db)): ...
```

---

## Advanced Routing with Groups and Routes

Nexios provides granular control over routing through the `Route` and `Group` classes, allowing for sophisticated API structures beyond simple decorators.

### The `Route` Class

The `Route` class is the fundamental unit of routing. It encapsulates not just the path and handler, but also validation, documentation, and metadata.

```python
from nexios.routing import Route
from pydantic import BaseModel

class UserSchema(BaseModel):
    name: str

async def create_user(req, res):
    return res.status(201).json(req.body)

# Creating a route manually
user_create_route = Route(
    path="/users",
    handler=create_user,
    methods=["POST"],
    name="user-create",
    request_model=UserSchema,
    summary="Create a new user",
    tags=["Management"]
)

app.add_route(user_create_route)
```

**Key Attributes:**

- `raw_path`: The path pattern (e.g., `/items/{id:int}`).
- `handler`: The async function. Dependencies are automatically injected via `inject_dependencies`.
- `methods`: A set of allowed HTTP methods (e.g., `{"GET", "POST"}`).
- `request_model`: Pydantic model for automatic validation and OpenAPI.
- `responses`: Documentation for different status codes.

### `Group` for Hierarchical Routing

The `Group` class is used to mount an entire ASGI application or a list of routes under a specific path prefix, typically with its own middleware stack.

```python
from nexios.routing import Group, Route
from nexios.middleware import BaseMiddleware

class LoggingMiddleware(BaseMiddleware):
    async def process_request(self, req, res, next):
        print(f"Group Request: {req.path}")
        await next()

# A group with its own routes and middleware
api_v1 = Group(
    path="/api/v1",
    middleware=[(LoggingMiddleware, [], {})],
    routes=[
        Route("/health", lambda req, res: res.text("OK"), methods=["GET"])
    ]
)

app.mount_router(api_v1)
```

**Internal Logic:**
When a request enters a `Group`, the prefix is stripped from the `path` and added to `root_path` in the ASGI scope. This allows nested routers to define routes relative to their mount point.

---

## Custom Authentication Backends

Nexios allows you to implement custom authentication logic by subclassing `AuthenticationBackend`.

### Implementing a Backend

You must override the `authenticate()` method. This method receives the `request` and `response` objects and must return an `AuthResult`.

```python
from nexios.auth.backends.base import AuthenticationBackend
from nexios.auth.model import AuthResult
from nexios.auth.users.base import SimpleUser
from nexios.exceptions import AuthenticationError

class HeaderAuthBackend(AuthenticationBackend):
    async def authenticate(self, request, response) -> AuthResult:
        token = request.headers.get("X-API-Key")
        
        if not token:
            return AuthResult(SimpleUser(is_authenticated=False))
            
        if token == "secret-key":
             # Return authenticated user
             return AuthResult(SimpleUser(identity="admin", is_authenticated=True))
        
        raise AuthenticationError("Invalid API Key")

# Registering the custom backend
from nexios.auth.middleware import AuthenticationMiddleware
app.add_middleware(AuthenticationMiddleware(backend=HeaderAuthBackend()))
```

### Multi-Backend Support

The `AuthenticationMiddleware` can wrap a single backend. For multiple strategies, you can either chain middleware or implement a "Composite" backend that iterates through multiple checks.

---

## Advanced Authentication Patterns

### Scoped Permissions

Nexios supports declarative permission checks that can be applied at the router or route level.

```python
from nexios.auth.decorators import has_permission

@app.get("/settings")
@has_permission("settings.view")
async def settings(req, res):
    return res.json({"theme": "dark"})
```

### Dynamic Permission Guards

For complex logic (e.g., checking if a user owns a resource), you can use custom dependency-based guards.

```python
from nexios import Depend, Context
from nexios.exceptions import PermissionDenied

async def is_resource_owner(ctx: Context = Depend(Context)):
    resource_id = ctx.request.path_params.get("id")
    if not await db.check_owner(ctx.user.identity, resource_id):
        raise PermissionDenied("You do not own this resource")

@app.delete("/resource/{id}", dependencies=[Depend(is_resource_owner)])
async def delete_resource(req, res):
    return res.status(204).json(None)
```

---

## Advanced Dependency Injection

Nexios's DI system is context-aware and supports deep nesting and resource lifecycle management.

### The `Context` Object

The `Context` object is a special dependency that provides access to the request scope, the main application, and the authenticated user.

```python
from nexios import Depend, Context

async def get_db_session(ctx: Context = Depend(Context)):
    # Access custom state from middleware
    db_pool = ctx.base_app.state.get("db_pool")
    
    # Access request details
    user_agent = ctx.request.headers.get("user-agent")
    
    conn = await db_pool.acquire()
    try:
        yield conn
    finally:
        await db_pool.release(conn)

@app.get("/data")
async def data_handler(req, res, db=Depend(get_db_session)):
    # db is now an active connection
    return res.json({"status": "connected"})
```

### Deep Context Propagation

Because Nexios uses `contextvars` to store the `current_context`, even deeply nested utility functions can access the request context without having it explicitly passed down.

---

## Deep Nexios Concepts

### Event System Internals

The Nexios event system handles propagation in three phases, similar to the DOM:

1. **Capturing Phase**: The event travels from the top-level parent down to the target.
2. **At Target Phase**: Listeners registered directly on the triggered event are executed.
3. **Bubbling Phase**: The event travels back up from the target to the root.

**Execution Order & Priority:**
Listeners are executed based on their `EventPriority` (HIGHEST to LOWEST).

> [!WARNING]
> Events should be used primarily for side effects (e.g., logging, notifications) and should not be relied upon to modify data essential for the main request response, as they are decoupled execution flows.

```python
from nexios.events import EventPriority

@app.events.on("user.login", priority=EventPriority.HIGHEST)
async def security_audit(user):
    print("Highest priority audit run first")

@app.events.on("user.login", priority=EventPriority.LOW)
async def secondary_task(user):
    print("Lower priority task run later")
```

> [!TIP]
> Always use `async def` for event listeners to prevent blocking the application's event loop.

### Response Processing Pipeline

When a handler returns a value, Nexios goes through these steps:

1. **Resolution**: If the return value is a coroutine, it is awaited.
2. **Transformation**: Non-response objects (like dicts or strings) are converted into `JSONResponse` or `PlainTextResponse` automatically by the `request_response` internals.
3. **Middleware**: The `process_response` methods of the middleware stack are executed in reverse order.

### Application Lifecycle

Nexios manages resources via ASGI lifespan events:

- **Startup**: Triggers `on_startup` handlers. Ideal for DB connection pools or cache warming.
- **Shutdown**: Triggers `on_shutdown` handlers. Ensures graceful cleanup of file handles and network connections.

```python
@app.on_startup
async def start_db():
    print("Connecting...")

@app.on_shutdown
async def stop_db():
    print("Disconnecting...")
```

---

## Advanced WebSocket Features

### Manual Handshake Control

While `@app.ws` handles the handshake automatically, you can gain more control using the `WebSocket` object directly.

```python
@app.ws("/v1/socket")
async def manual_socket(ws):
    # Conditionally accept based on headers/cookies
    if ws.headers.get("origin") != "https://trusted.com":
        await ws.close(code=4003)
        return
        
    await ws.accept()
    await ws.send_text("Welcome")
```

---

## Performance and Production

### Deployment with Gunicorn/Uvicorn

For production, use `gunicorn` with the `uvicorn` worker class for process management and multi-core utilization.

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Performance Tuning

- **Profiling**: Use the built-in `TaskGroup` to parallelize independent I/O operations.
- **Lazy Execution**: Use `AsyncLazy` for computationally expensive values that are only needed conditionally.

---

## Testing and Best Practices

### Dependency Overrides

Testing is made simple by overriding dependencies in your `TestClient` setup.

```python
from nexios.testing import TestClient

def get_test_db():
    return MockDatabase()

client = TestClient(app)
app.dependency_overrides[get_db] = get_test_db
```

### Error Handling Best Practices

Always use custom `ExceptionHandlers` to avoid leaking internal stack traces to clients.

```python
from nexios.exceptions import HTTPException

@app.exception_handler(HTTPException)
async def custom_http_error(req, res, exc):
    return res.status(exc.status_code).json({
        "error": exc.detail,
        "code": "API_ERROR"
    })
```
