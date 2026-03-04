# API Reference

Complete API documentation for the Brodcasta real-time messaging platform.

## Base URL

```
http://localhost:8041/api
```

## Authentication

### Project-based Authentication

All API requests require project authentication via:
- **Project ID** - URL parameter
- **Project Secret** - Header or query parameter

```bash
# Header authentication
curl -H "X-Project-Secret: your-secret" http://localhost:8041/api/projects

# Query parameter authentication
curl "http://localhost:8041/api/projects?secret=your-secret"
```

### JWT Authentication (Optional)

If project requires JWT authentication:

```bash
# Get JWT token
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

# Use token in requests
curl -H "Authorization: Bearer your-jwt-token" http://localhost:8041/api/projects
```

## Projects API

### List Projects

```http
GET /api/projects
```

**Response:**
```json
[
  {
    "id": "proj_123",
    "name": "My Chat App",
    "project_secret": "secret_abc123",
    "auth_type": "none",
    "history_enabled": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Project

```http
POST /api/projects
```

**Body:**
```json
{
  "name": "New Project",
  "auth_type": "none",
  "history_enabled": true
}
```

**Response:**
```json
{
  "id": "proj_456",
  "name": "New Project",
  "project_secret": "generated_secret_xyz",
  "auth_type": "none",
  "history_enabled": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Get Project

```http
GET /api/projects/{project_id}
```

**Response:**
```json
{
  "id": "proj_123",
  "name": "My Chat App",
  "project_secret": "secret_abc123",
  "auth_type": "none",
  "history_enabled": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Update Project

```http
PUT /api/projects/{project_id}
```

**Body:**
```json
{
  "name": "Updated Project Name",
  "auth_type": "api_key",
  "history_enabled": false
}
```

### Delete Project

```http
DELETE /api/projects/{project_id}
```

**Response:** `204 No Content`

### Regenerate Project Secret

```http
POST /api/projects/{project_id}/regenerate-secret
```

**Response:**
```json
{
  "project_secret": "new_generated_secret_xyz"
}
```

## Real-time Connections

### WebSocket Connection

```javascript
const ws = new WebSocket('ws://localhost:8041/ws/{project_id}?secret={project_secret}');

// Join room
ws.send(JSON.stringify({
  type: 'join',
  room: 'room_name',
  data: {}
}));

// Send message
ws.send(JSON.stringify({
  type: 'message',
  room: 'room_name',
  data: {
    message: 'Hello World!',
    sender_id: 'client_123'
  }
}));
```

### Server-Sent Events Connection

```javascript
const eventSource = new EventSource(`http://localhost:8041/sse/{project_id}/connect?secret={project_secret}`);

// Listen for messages
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Send via SSE

```http
POST /api/sse/{project_id}/send
```

**Body:**
```json
{
  "room": "room_name",
  "event_type": "message",
  "data": {
    "message": "Hello World!",
    "sender_id": "client_123"
  }
}
```

## Messages API

### Get Message History

```http
GET /api/messages/{project_id}?room={room_name}&limit=50&offset=0
```

**Query Parameters:**
- `room` (string, required): Room name
- `limit` (int, optional): Number of messages (default: 50)
- `offset` (int, optional): Pagination offset (default: 0)

**Response:**
```json
{
  "messages": [
    {
      "id": "msg_123",
      "room_id": "room_name",
      "data": {
        "message": "Hello World!",
        "sender_id": "client_123"
      },
      "sender_id": "client_123",
      "message_type": "room_message",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

### Send Message (HTTP)

```http
POST /api/messages/{project_id}
```

**Body:**
```json
{
  "room": "room_name",
  "message": "Hello World!",
  "sender_id": "client_123"
}
```

## Analytics API

### Get Project Analytics

```http
GET /api/analytics/projects/{project_id}/overview?filter_type=day&start_date=2024-01-01&end_date=2024-01-02
```

**Query Parameters:**
- `filter_type` (string): `hour`, `day`, `week`, `month`, `all`
- `start_date` (date, optional): Start date (YYYY-MM-DD)
- `end_date` (date, optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "current_stats": {
    "total_events": 1250,
    "messages_sent": 850,
    "messages_received": 400,
    "connections": 25,
    "websocket_connections": 20,
    "sse_connections": 5,
    "avg_message_size": 256
  },
  "hourly_chart": {
    "labels": ["00:00", "01:00", "02:00"],
    "datasets": {
      "messages_sent": [10, 15, 12]
    }
  },
  "daily_chart": {
    "labels": ["2024-01-01", "2024-01-02"],
    "datasets": {
      "messages_sent": [100, 150]
    }
  }
}
```

### Get Message Statistics

```http
GET /api/analytics/projects/{project_id}/messages
```

**Response:**
```json
{
  "total_messages": 1000,
  "room_messages": 800,
  "broadcast_messages": 150,
  "direct_messages": 50
}
```

## Authentication API

### User Registration

```http
POST /api/auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

### User Login

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required/invalid
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project name",
    "details": {
      "field": "name",
      "reason": "must be at least 3 characters"
    }
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General API**: 100 requests per minute
- **Message sending**: 60 messages per minute per project
- **Analytics**: 30 requests per minute per project

Rate limit headers are included in responses:
```bash
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## WebSocket Events

### Client to Server Events

**Join Room:**
```json
{
  "type": "join",
  "room": "room_name",
  "data": {}
}
```

**Leave Room:**
```json
{
  "type": "leave",
  "room": "room_name",
  "data": {}
}
```

**Send Message:**
```json
{
  "type": "message",
  "room": "room_name",
  "data": {
    "message": "Hello World!",
    "sender_id": "client_123"
  }
}
```

**Broadcast Message:**
```json
{
  "type": "broadcast",
  "data": {
    "message": "Broadcast to all!",
    "sender_id": "client_123"
  }
}
```

**Direct Message:**
```json
{
  "type": "direct",
  "data": {
    "message": "Private message",
    "sender_id": "client_123",
    "target_client_id": "client_456"
  }
}
```

### Server to Client Events

**Message Received:**
```json
{
  "type": "message.received",
  "data": {
    "room_id": "room_name",
    "message": "Hello World!",
    "sender_id": "client_123",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**Client Connected:**
```json
{
  "type": "client.connected",
  "data": {
    "client_id": "client_123",
    "room_id": "room_name",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**Client Disconnected:**
```json
{
  "type": "client.disconnected",
  "data": {
    "client_id": "client_123",
    "room_id": "room_name",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## SDK Integration

For easier integration, use our official SDK:

```bash
npm install brodcasta-sdk
```

See the [SDK Documentation](./sdk.md) for detailed usage examples.
