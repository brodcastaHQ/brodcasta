# SDK Documentation

Complete guide for using the Brodcasta TypeScript SDK.

## Installation

```bash
npm install brodcasta-sdk
```

## Basic Usage

### Initialize Client

```typescript
import { BrodcastaClient } from 'brodcasta-sdk';

const client = new BrodcastaClient({
  baseUrl: 'https://your-brodcasta-instance.com',
  projectId: 'your-project-id',
  projectSecret: 'your-project-secret',
  room: 'general',
  prefer: 'ws', // 'ws' | 'sse'
  fallbackToSse: true
});
```

### Connect and Join Room

```typescript
await client.connect();
await client.join('general');
```

### Send Messages

```typescript
// Send to room
await client.sendMessage('general', 'Hello everyone!');

// Broadcast to all clients
await client.broadcast('Important announcement!');

// Send directly to specific client
await client.direct('client_123', 'Private message');
```

### Listen for Events

```typescript
// Connection events
client.on('open', ({ transport }) => {
  console.log(`Connected via ${transport}`);
});

client.on('close', ({ code, reason }) => {
  console.log(`Connection closed: ${reason}`);
});

// Message events
client.onEvent('message.received', (data) => {
  console.log('New message:', data.message);
});

client.onEvent('user.joined', (data) => {
  console.log(`${data.userId} joined ${data.roomId}`);
});

client.onEvent('user.left', (data) => {
  console.log(`${data.userId} left ${data.roomId}`);
});
```

## Configuration Options

### Client Options

```typescript
interface BrodcastaClientOptions {
  // Required
  baseUrl: string;
  projectId: string;
  projectSecret: string;
  
  // Optional
  wsPath?: string;           // Default: '/ws/{projectId}'
  ssePath?: string;          // Default: '/sse/{projectId}/connect'
  sendPath?: string;          // Default: '/sse/{projectId}/send'
  secretQueryParam?: string;   // Default: 'secret'
  headers?: Record<string, string>;
  
  // Transport preferences
  prefer?: 'ws' | 'sse';     // Default: 'ws'
  fallbackToSse?: boolean;    // Default: true
  
  // Auto-join room on connect
  room?: string;
  
  // Reconnection settings
  reconnect?: {
    enabled?: boolean;         // Default: true
    maxAttempts?: number;     // Default: 10
    minDelayMs?: number;     // Default: 500
    maxDelayMs?: number;     // Default: 8000
    jitter?: number;          // Default: 0.3
    fallbackAfter?: number;    // Default: 1
  };
  
  // Custom parsers/formatters
  parseEvent?: (data: string) => any;
  formatSend?: (event: any) => string;
  formatJoin?: (roomId: string, payload?: any) => any;
}
```

### Type Definitions

```typescript
// Define your event types for type safety
type InboundEvents = {
  'message.received': {
    room_id: string;
    message: string;
    sender_id: string;
    timestamp: string;
  };
  'user.joined': {
    room_id: string;
    user_id: string;
    timestamp: string;
  };
  'user.left': {
    room_id: string;
    user_id: string;
    timestamp: string;
  };
};

type OutboundEvents = {
  'message.send': {
    room_id: string;
    message: string;
  };
  'message.broadcast': {
    message: string;
  };
  'message.direct': {
    target_client_id: string;
    message: string;
  };
};

// Create typed client
const client = new BrodcastaClient<InboundEvents, OutboundEvents>({
  baseUrl: 'https://api.example.com',
  projectId: 'proj_123',
  projectSecret: 'secret_abc'
});
```

## API Reference

### Connection Methods

#### `connect(): Promise<void>`
Establish connection to the server.

```typescript
await client.connect();
```

#### `disconnect(): void`
Close the connection.

```typescript
client.disconnect();
```

#### `getState(): ConnectionState`
Get current connection state.

```typescript
const state = client.getState();
// Returns: 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
```

#### `getTransport(): Transport`
Get active transport type.

```typescript
const transport = client.getTransport();
// Returns: 'ws' | 'sse'
```

#### `getClientId(): string | null`
Get assigned client ID.

```typescript
const clientId = client.getClientId();
```

#### `getClientToken(): string | null`
Get authentication token.

```typescript
const token = client.getClientToken();
```

### Room Management

#### `join(roomId: string, payload?: any): Promise<void>`
Join a room.

```typescript
await client.join('chat-room');
await client.join('notifications', { userId: 'user_123' });
```

#### `leave(roomId: string, payload?: any): Promise<void>`
Leave a room.

```typescript
await client.leave('chat-room');
await client.leave('notifications', { reason: 'logout' });
```

### Messaging

#### `send(eventType: string, data: any, roomId?: string): Promise<void>`
Send custom event.

```typescript
await client.send('custom.event', { data: 'value' }, 'room-name');
```

#### `sendMessage(roomId: string, message: string): Promise<void>`
Send message to room.

```typescript
await client.sendMessage('general', 'Hello World!');
```

#### `broadcast(message: string): Promise<void>`
Broadcast to all clients.

```typescript
await client.broadcast('Server maintenance in 5 minutes');
```

#### `direct(targetClientId: string, message: string): Promise<void>`
Send direct message.

```typescript
await client.direct('client_456', 'Private message');
```

#### `ping(): Promise<void>`
Send ping to server.

```typescript
await client.ping();
```

#### `sendRaw(payload: any): Promise<void>`
Send raw payload.

```typescript
await client.sendRaw({ type: 'custom', data: { value: 123 } });
```

### Event Handling

#### `on(event: string, listener: Function): void`
Listen to connection events.

```typescript
client.on('open', ({ transport, clientId }) => {
  console.log(`Connected via ${transport} as ${clientId}`);
});

client.on('close', ({ code, reason }) => {
  console.log(`Disconnected: ${reason} (${code})`);
});

client.on('error', (error) => {
  console.error('Connection error:', error);
});

client.on('reconnect', ({ attempt, maxAttempts }) => {
  console.log(`Reconnecting ${attempt}/${maxAttempts}`);
});

client.on('transport', ({ from, to }) => {
  console.log(`Transport changed from ${from} to ${to}`);
});
```

#### `onEvent<T>(eventType: string, listener: (data: T) => void): void`
Listen to typed message events.

```typescript
client.onEvent('message.received', (data) => {
  // TypeScript knows data shape
  console.log(`${data.sender_id}: ${data.message}`);
});

client.onEvent('user.joined', (data) => {
  console.log(`${data.user_id} joined ${data.room_id}`);
});
```

#### `off(event: string, listener?: Function): void`
Remove event listener.

```typescript
const listener = (data) => console.log(data);
client.onEvent('message.received', listener);
client.off('message.received', listener);
```

## Advanced Usage

### Custom Event Parsing

```typescript
const client = new BrodcastaClient({
  baseUrl: 'https://api.example.com',
  projectId: 'proj_123',
  projectSecret: 'secret_abc',
  parseEvent: (data) => {
    // Custom parsing logic
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      timestamp: new Date().toISOString()
    };
  }
});
```

### Custom Send Formatting

```typescript
const client = new BrodcastaClient({
  baseUrl: 'https://api.example.com',
  projectId: 'proj_123',
  projectSecret: 'secret_abc',
  formatSend: (event) => {
    // Custom formatting
    return JSON.stringify({
      ...event,
      client_version: '1.0.0',
      sent_at: Date.now()
    });
  }
});
```

### Custom Headers

```typescript
const client = new BrodcastaClient({
  baseUrl: 'https://api.example.com',
  projectId: 'proj_123',
  projectSecret: 'secret_abc',
  headers: {
    'User-Agent': 'MyApp/1.0.0',
    'X-Custom-Header': 'custom-value'
  }
});
```

### Reconnection Configuration

```typescript
const client = new BrodcastaClient({
  baseUrl: 'https://api.example.com',
  projectId: 'proj_123',
  projectSecret: 'secret_abc',
  reconnect: {
    enabled: true,
    maxAttempts: 15,
    minDelayMs: 1000,
    maxDelayMs: 30000,
    jitter: 0.5,
    fallbackAfter: 2
  }
});
```

## Error Handling

### Connection Errors

```typescript
client.on('error', (error) => {
  if (error.code === 'SECRET_INVALID') {
    console.error('Invalid project secret');
  } else if (error.code === 'PROJECT_NOT_FOUND') {
    console.error('Project does not exist');
  } else {
    console.error('Connection error:', error);
  }
});
```

### Message Sending Errors

```typescript
try {
  await client.sendMessage('room', 'message');
} catch (error) {
  if (error.code === 'ROOM_NOT_JOINED') {
    console.error('Must join room before sending');
  } else if (error.code === 'RATE_LIMITED') {
    console.error('Message rate limit exceeded');
  }
}
```

## Examples

### Chat Application

```typescript
import { BrodcastaClient } from 'brodcasta-sdk';

type ChatEvents = {
  'message.received': {
    room_id: string;
    user_id: string;
    username: string;
    message: string;
    timestamp: string;
  };
  'user.joined': {
    room_id: string;
    user_id: string;
    username: string;
  };
  'user.left': {
    room_id: string;
    user_id: string;
    username: string;
  };
};

class ChatApp {
  private client: BrodcastaClient<ChatEvents, {}>;
  private currentRoom = 'general';
  private username = '';

  constructor() {
    this.client = new BrodcastaClient<ChatEvents, {}>({
      baseUrl: 'https://chat.example.com',
      projectId: 'chat-app',
      projectSecret: 'your-secret',
      room: this.currentRoom
    });

    this.setupEventListeners();
  }

  async connect(username: string) {
    this.username = username;
    await this.client.connect();
    await this.client.join(this.currentRoom, { username });
  }

  private setupEventListeners() {
    this.client.onEvent('message.received', (data) => {
      this.displayMessage(data.username, data.message);
    });

    this.client.onEvent('user.joined', (data) => {
      this.displaySystemMessage(`${data.username} joined the room`);
    });

    this.client.onEvent('user.left', (data) => {
      this.displaySystemMessage(`${data.username} left the room`);
    });
  }

  async sendMessage(message: string) {
    await this.client.send('chat.message', {
      username: this.username,
      message: message
    }, this.currentRoom);
  }

  private displayMessage(username: string, message: string) {
    // UI logic to display message
  }

  private displaySystemMessage(message: string) {
    // UI logic to display system message
  }
}
```

### Real-time Dashboard

```typescript
import { BrodcastaClient } from 'brodcasta-sdk';

type DashboardEvents = {
  'stats.update': {
    active_users: number;
    messages_per_minute: number;
    server_load: number;
  };
  'alert.triggered': {
    type: 'error' | 'warning' | 'info';
    message: string;
    severity: number;
  };
};

class Dashboard {
  private client: BrodcastaClient<DashboardEvents, {}>;

  constructor() {
    this.client = new BrodcastaClient<DashboardEvents, {}>({
      baseUrl: 'https://monitoring.example.com',
      projectId: 'dashboard',
      projectSecret: 'monitoring-secret'
    });

    this.setupMonitoring();
  }

  private setupMonitoring() {
    this.client.onEvent('stats.update', (data) => {
      this.updateCharts(data);
    });

    this.client.onEvent('alert.triggered', (alert) => {
      this.showAlert(alert);
    });
  }

  private updateCharts(stats: DashboardEvents['stats.update']) {
    // Update UI charts with new stats
  }

  private showAlert(alert: DashboardEvents['alert.triggered']) {
    // Show alert notification
  }
}
```

## Best Practices

1. **Type Safety**: Always define your event types for better TypeScript support
2. **Error Handling**: Implement proper error handling for connection and message errors
3. **Reconnection**: Enable automatic reconnection for production applications
4. **Rate Limiting**: Be mindful of rate limits when sending messages
5. **Cleanup**: Always disconnect when the component unmounts
6. **Room Management**: Join rooms only when needed and leave when done
7. **Security**: Keep project secrets secure and use HTTPS in production

## Troubleshooting

### Common Issues

**Connection Failed:**
- Check project ID and secret are correct
- Verify server URL is accessible
- Ensure firewall allows WebSocket/SSE connections

**Messages Not Received:**
- Verify you've joined the correct room
- Check event type matches server format
- Ensure client is connected before sending

**Reconnection Issues:**
- Check reconnection configuration
- Verify server supports reconnection
- Monitor network connectivity

### Debug Mode

Enable debug logging:

```typescript
const client = new BrodcastaClient({
  // ... other options
  debug: true  // Enable console logging
});
```

## Support

- 📖 **[API Reference](./api.md)** - Server API documentation
- 🚀 **[Getting Started](./getting-started.md)** - Setup guide
- 🐛 **[Issues](https://github.com/your-org/brodcasta-sdk/issues)** - SDK issues
- 💬 **[Discussions](https://github.com/your-org/brodcasta-sdk/discussions)** - Community support
