# Brodcasta

<div align="center">
  <img src="frontend/public/logo.svg" alt="Brodcasta Logo" width="120" height="120">
  
  <h3>Real-time messaging and event broadcasting platform</h3>
  
  <p>
    <strong>Brodcasta</strong> (also known as "Pingly") is a self-hosted real-time messaging platform built with modern web technologies. 
    It provides WebSocket and Server-Sent Events (SSE) connections for building real-time applications.
  </p>
</div>

## ✨ Features

- **🔄 Real-time Messaging** - WebSocket connections with automatic SSE fallback
- **🏠 Room-based Communication** - Join/leave rooms for organized messaging
- **📊 Analytics Dashboard** - Monitor connections, messages, and performance metrics
- **🔐 Flexible Authentication** - Support for API keys, JWT, or no authentication
- **📝 Message History** - Optional persistent storage for message analytics
- **🎯 Direct Messaging** - Send messages directly to specific clients
- **📡 Broadcasting** - Send messages to all connected clients
- **📱 Modern UI** - Clean, responsive interface built with React and DaisyUI
- **🚀 High Performance** - Built on Nexios framework with Redis pub/sub

## 🏗️ Architecture

### Backend (Python)
- **Framework**: [Nexios](https://nexioslabs.com) - Modern async web framework
- **Database**: Tortoise ORM with SQLite/PostgreSQL support
- **Real-time**: Redis for pub/sub and message fanout
- **Authentication**: JWT with bcrypt password hashing
- **Protocols**: WebSocket and Server-Sent Events

### Frontend (React)
- **Framework**: React 19 with Vite
- **Styling**: TailwindCSS with DaisyUI components
- **State Management**: React hooks and context
- **HTTP Client**: Axios with custom client utilities
- **SDK**: TypeScript client for easy integration

### SDK
- **TypeScript**: Fully typed client library
- **Auto-fallback**: WebSocket with SSE fallback
- **Room Management**: Built-in room join/leave functionality
- **Event Handling**: Strongly typed inbound/outbound events
- **Reconnection**: Automatic reconnection strategies

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Redis server
- PostgreSQL (optional, defaults to SQLite)

### Backend Setup

```bash
cd server
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
python manage.py migrate

# Start the server
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8041

## 📖 Documentation

### Project Documentation
- **[Getting Started Guide](./docs/getting-started.md)** - Learn the basics
- **[API Reference](./docs/api.md)** - Complete API documentation
- **[SDK Usage](./docs/sdk.md)** - Client SDK documentation
- **[Deployment Guide](./docs/deployment.md)** - Production deployment

### Nexios Framework
This project is built with [**Nexios**](https://nexios.dev) - a modern Python web framework.

- 📖 **[Nexios Documentation](https://docs.nexios.dev)**
- 🚀 **[Nexios GitHub](https://github.com/nexios/nexios)**
- 💬 **[Nexios Community](https://github.com/nexios/nexios/discussions)**

## 🔧 Configuration

### Environment Variables

```bash
# Database
DB_URL=sqlite://db.sqlite3  # or postgresql://user:pass@host/db

# Security
SECRET_KEY=your-secret-key-here

# Redis
REDIS_URL=redis://localhost:6379

# Server
HOST=0.0.0.0
PORT=8041
```

### Project Settings

Each project supports:
- **Authentication Type**: None, API Key Required, or JWT Required
- **Message History**: Enable/disable persistent storage
- **Project Secret**: Auto-generated secret for client authentication

## 📡 SDK Usage

### Installation

```bash
npm install brodcasta-sdk
```

### Basic Usage

```typescript
import { PinglyClient } from 'brodcasta-sdk';

const client = new PinglyClient({
  baseUrl: 'http://localhost:8041',
  projectId: 'your-project-id',
  projectSecret: 'your-project-secret',
  room: 'general'
});

await client.connect();
await client.join('general');
await client.sendMessage('general', 'Hello, World!');

client.onEvent('message.received', (data) => {
  console.log('New message:', data);
});
```

## 🏢 Self-Hosting

Brodcasta is designed for self-hosting. Perfect for:

- **Development teams** needing real-time features
- **SaaS applications** requiring WebSocket infrastructure  
- **IoT projects** with device communication
- **Chat applications** and social platforms
- **Live dashboards** and monitoring tools

### Deployment Options

- **Docker**: Ready-to-use Docker configuration
- **Kubernetes**: Helm charts for scalable deployment
- **Cloud**: AWS, Google Cloud, Azure compatible
- **On-premise**: Private data center deployment

See [Deployment Guide](./docs/deployment.md) for detailed instructions.

## 📊 API Endpoints

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Real-time
- `WS /ws/{project_id}` - WebSocket connection
- `SSE /sse/{project_id}/connect` - SSE connection
- `POST /sse/{project_id}/send` - Send via SSE

### Analytics
- `GET /api/analytics/projects/{id}/overview` - Project analytics
- `GET /api/analytics/projects/{id}/messages` - Message history

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/brodcasta.git
cd brodcasta

# Setup backend
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install

# Run development servers
npm run dev:all  # Runs both backend and frontend
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- 📖 **[Documentation](./docs/)**
- 🐛 **[Issue Tracker](https://github.com/your-org/brodcasta/issues)**
- 💬 **[Discussions](https://github.com/your-org/brodcasta/discussions)**

---

<div align="center">
  <p>
    <strong>Powered by</strong>
    <a href="https://nexioslabs.com" target="_blank" rel="noopener noreferrer">
      <img src="https://nexioslabs.com/logo.png" alt="Nexios Logo" width="100" height="20">
    </a>
  </p>
  
  <p>
    <em>Built with ❤️ using the Nexios framework</em>
  </p>
</div>
