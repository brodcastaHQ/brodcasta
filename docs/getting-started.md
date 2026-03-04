# Getting Started Guide

Welcome to Brodcasta! This guide will help you get your real-time messaging platform up and running.

## What is Brodcasta?

Brodcasta is a self-hosted real-time messaging platform that enables:
- WebSocket and Server-Sent Events (SSE) connections
- Room-based messaging
- Direct client-to-client communication
- Broadcasting to all connected clients
- Message analytics and history

## Prerequisites

Before you begin, ensure you have:

- **Python 3.11+** - For the backend server
- **Node.js 18+** - For the frontend development
- **Redis server** - For real-time message pub/sub
- **Git** - To clone the repository

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/brodcasta.git
cd brodcasta
```

### 2. Backend Setup

```bash
cd server

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment configuration
cp .env.example .env
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Configuration

### Backend Environment

Edit the `.env` file in the server directory:

```bash
# Database Configuration
DB_URL=sqlite://db.sqlite3
# Or for PostgreSQL:
# DB_URL=postgresql://username:password@localhost:5432/brodcasta

# Security
SECRET_KEY=your-very-secret-key-here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Server Configuration
HOST=0.0.0.0
PORT=8041
```

### Frontend Environment

Create `.env` file in the frontend directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:8041
```

## Running the Application

### Option 1: Run Separately

**Backend:**
```bash
cd server
source .venv/bin/activate  # Activate virtual environment
python main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Run Together (Development)

From the project root:
```bash
npm run dev:all
```

## Accessing the Application

Once running, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8041
- **API Documentation**: http://localhost:8041/docs

## Creating Your First Project

1. Open http://localhost:5173 in your browser
2. Click "Create Project"
3. Enter a project name (e.g., "My Chat App")
4. Choose authentication settings:
   - **None**: Open access
   - **API Key**: Require API key
   - **JWT**: Require JWT authentication
5. Click "Create Project"

## Testing Real-time Features

### Using the Built-in Playground

1. Go to your project dashboard
2. Click "Playground" in the sidebar
3. Open the playground in multiple browser tabs
4. Send messages between tabs

### Using the SDK

Install the SDK:
```bash
npm install brodcasta-sdk
```

Create a test client:
```javascript
import { PinglyClient } from 'brodcasta-sdk';

const client = new PinglyClient({
  baseUrl: 'http://localhost:8041',
  projectId: 'your-project-id',
  projectSecret: 'your-project-secret',
  room: 'test-room'
});

await client.connect();
await client.join('test-room');

// Send a message
await client.sendMessage('test-room', 'Hello from SDK!');

// Listen for messages
client.onEvent('message.received', (data) => {
  console.log('Received:', data);
});
```

## Next Steps

- 📖 **[API Reference](./api.md)** - Learn about all API endpoints
- 🔧 **[SDK Documentation](./sdk.md)** - Detailed SDK usage
- 🚀 **[Deployment Guide](./deployment.md)** - Production deployment
- 📊 **[Analytics Guide](./analytics.md)** - Monitoring and metrics

## Troubleshooting

### Common Issues

**Redis Connection Failed:**
```bash
# Make sure Redis is running
redis-server

# Or start with Docker
docker run -d -p 6379:6379 redis:alpine
```

**Database Migration Error:**
```bash
cd server
python manage.py migrate
```

**Frontend Build Error:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- 📖 Check the [documentation](./)
- 🐛 Report [issues](https://github.com/your-org/brodcasta/issues)
- 💬 Join our [discussions](https://github.com/your-org/brodcasta/discussions)

## Security Considerations

- Keep your `SECRET_KEY` secure and private
- Use HTTPS in production
- Enable appropriate authentication for your use case
- Regularly update dependencies
- Monitor Redis access in production

Happy coding with Brodcasta! 🚀
