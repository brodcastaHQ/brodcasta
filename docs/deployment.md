# Deployment Guide

Production deployment guide for Brodcasta real-time messaging platform.

## Overview

Brodcasta can be deployed in various environments:
- **Docker** - Containerized deployment
- **Kubernetes** - Scalable orchestration
- **Cloud Platforms** - AWS, Google Cloud, Azure
- **Traditional Servers** - VPS or dedicated servers

## Prerequisites

- **Domain name** (recommended)
- **SSL certificate** (required for production)
- **Redis server** (can be managed service)
- **Database** (PostgreSQL recommended for production)
- **Load balancer** (for high availability)

## Environment Configuration

### Production Environment Variables

```bash
# Database (PostgreSQL recommended)
DB_URL=postgresql://username:password@localhost:5432/brodcasta_prod

# Security
SECRET_KEY=your-very-secure-secret-key-here
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Redis
REDIS_URL=redis://redis-server:6379
REDIS_PASSWORD=your-redis-password

# Server
HOST=0.0.0.0
PORT=8041
ENVIRONMENT=production

# SSL (if using reverse proxy)
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/brodcasta/app.log
```

## Docker Deployment

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  brodcasta:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "8041:8041"
    environment:
      - DB_URL=postgresql://postgres:password@db:5432/brodcasta
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=${SECRET_KEY}
      - ENVIRONMENT=production
    depends_on:
      - db
      - redis
    restart: unless-stopped
    volumes:
      - ./logs:/var/log/brodcasta

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=brodcasta
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - brodcasta
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Dockerfile

Create `server/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8041

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8041/health || exit 1

# Start the application
CMD ["python", "main.py"]
```

### Deploy with Docker

```bash
# Set environment variables
export SECRET_KEY="your-secret-key"
export REDIS_PASSWORD="your-redis-password"

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f brodcasta

# Scale horizontally
docker-compose up -d --scale brodcasta=3
```

## Kubernetes Deployment

### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: brodcasta
```

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: brodcasta-config
  namespace: brodcasta
data:
  DB_URL: "postgresql://postgres:password@postgres:5432/brodcasta"
  REDIS_URL: "redis://redis:6379"
  ENVIRONMENT: "production"
  LOG_LEVEL: "INFO"
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: brodcasta-secrets
  namespace: brodcasta
type: Opaque
data:
  SECRET_KEY: <base64-encoded-secret>
  REDIS_PASSWORD: <base64-encoded-password>
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: brodcasta
  namespace: brodcasta
spec:
  replicas: 3
  selector:
    matchLabels:
      app: brodcasta
  template:
    metadata:
      labels:
        app: brodcasta
    spec:
      containers:
      - name: brodcasta
        image: brodcasta:latest
        ports:
        - containerPort: 8041
        env:
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: brodcasta-secrets
              key: SECRET_KEY
        - name: DB_URL
          valueFrom:
            configMapKeyRef:
              name: brodcasta-config
              key: DB_URL
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: brodcasta-config
              key: REDIS_URL
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8041
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8041
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: brodcasta-service
  namespace: brodcasta
spec:
  selector:
    app: brodcasta
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8041
  type: ClusterIP
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: brodcasta-ingress
  namespace: brodcasta
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
spec:
  tls:
  - hosts:
    - brodcasta.yourdomain.com
    secretName: brodcasta-tls
  rules:
  - host: brodcasta.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: brodcasta-service
            port:
              number: 80
```

### Deploy to Kubernetes

```bash
# Apply all configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n brodcasta

# View logs
kubectl logs -f deployment/brodcasta -n brodcasta

# Scale deployment
kubectl scale deployment brodcasta --replicas=5 -n brodcasta
```

## Cloud Platform Deployment

### AWS ECS

#### Task Definition

```json
{
  "family": "brodcasta",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "brodcasta",
      "image": "your-account.dkr.ecr.region.amazonaws.com/brodcasta:latest",
      "portMappings": [
        {
          "containerPort": 8041,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DB_URL",
          "value": "postgresql://user:pass@rds-endpoint:5432/brodcasta"
        },
        {
          "name": "REDIS_URL",
          "value": "redis://elasticache-endpoint:6379"
        },
        {
          "name": "SECRET_KEY",
          "value": "your-secret-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/brodcasta",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Service Definition

```json
{
  "cluster": "brodcasta-cluster",
  "serviceName": "brodcasta-service",
  "taskDefinition": "brodcasta",
  "desiredCount": 2,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["subnet-123", "subnet-456"],
      "securityGroups": ["sg-123"],
      "assignPublicIp": "ENABLED"
    }
  },
  "loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:region:account:targetgroup/brodcasta",
      "containerName": "brodcasta",
      "containerPort": 8041
    }
  ]
}
```

### Google Cloud Run

```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT-ID/brodcasta

# Deploy to Cloud Run
gcloud run deploy brodcasta \
  --image gcr.io/PROJECT-ID/brodcasta \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DB_URL=postgresql://...,REDIS_URL=redis://...,SECRET_KEY=...
```

### Azure Container Instances

```bash
# Create resource group
az group create --name brodcasta-rg --location eastus

# Deploy container
az container create \
  --resource-group brodcasta-rg \
  --name brodcasta \
  --image your-registry/brodcasta:latest \
  --cpu 1 \
  --memory 2 \
  --ports 8041 \
  --environment-variables DB_URL=postgresql://... REDIS_URL=redis://... SECRET_KEY=...
```

## Nginx Reverse Proxy

### Configuration

```nginx
upstream brodcasta_backend {
    server brodcasta1:8041;
    server brodcasta2:8041;
    server brodcasta3:8041;
}

server {
    listen 80;
    server_name brodcasta.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name brodcasta.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # WebSocket proxying
    location /ws/ {
        proxy_pass http://brodcasta_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # SSE proxying
    location /sse/ {
        proxy_pass http://brodcasta_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_no_cache $http_upgrade;
        proxy_buffering off;
    }

    # API proxying
    location /api/ {
        proxy_pass http://brodcasta_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

## Monitoring and Logging

### Health Checks

```bash
# Application health endpoint
curl https://brodcasta.yourdomain.com/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "connections": {
    "websocket": 150,
    "sse": 25
  }
}
```

### Log Management

```bash
# View application logs
tail -f /var/log/brodcasta/app.log

# Rotate logs (logrotate)
sudo logrotate /etc/logrotate.d/brodcasta

# Centralized logging (ELK stack)
# Configure filebeat to ship logs to Elasticsearch
```

### Metrics Collection

```yaml
# Prometheus configuration
scrape_configs:
  - job_name: 'brodcasta'
    static_configs:
      - targets: ['brodcasta:8041']
    metrics_path: '/metrics'
    scrape_interval: 15s
```

## Security

### SSL/TLS

```bash
# Let's Encrypt certificate
certbot --nginx -d brodcasta.yourdomain.com

# Auto-renewal
0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Rules

```bash
# UFW configuration
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Rate Limiting

```nginx
# Nginx rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=ws:10m rate=5r/s;

server {
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://brodcasta_backend;
    }

    location /ws/ {
        limit_req zone=ws burst=10 nodelay;
        proxy_pass http://brodcasta_backend;
    }
}
```

## Performance Optimization

### Database Optimization

```sql
-- PostgreSQL configuration
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
SELECT pg_reload_conf();
```

### Redis Optimization

```bash
# Redis configuration
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### Application Scaling

```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: brodcasta-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: brodcasta
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Backup and Recovery

### Database Backups

```bash
# Automated PostgreSQL backups
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -h localhost -U postgres brodcasta | gzip > "$BACKUP_DIR/brodcasta_$DATE.sql.gz"

# Keep last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

### Redis Backups

```bash
# Redis backup script
#!/bin/bash
BACKUP_DIR="/backups/redis"
DATE=$(date +%Y%m%d_%H%M%S)

redis-cli --rdb "$BACKUP_DIR/redis_$DATE.rdb"
```

### Disaster Recovery

1. **Restore Database**
```bash
gunzip -c /backups/postgres/brodcasta_latest.sql.gz | psql -h localhost -U postgres brodcasta
```

2. **Restore Redis**
```bash
redis-cli --rdb /backups/redis/redis_latest.rdb
```

3. **Verify Services**
```bash
# Check all services
systemctl status brodcasta postgresql redis nginx

# Test connectivity
curl -f https://brodcasta.yourdomain.com/health
```

## Troubleshooting

### Common Issues

**High Memory Usage:**
- Check for memory leaks in application
- Monitor Redis memory usage
- Optimize database queries

**Connection Drops:**
- Verify load balancer configuration
- Check WebSocket timeout settings
- Monitor network latency

**Database Performance:**
- Analyze slow queries
- Check connection pool size
- Monitor disk I/O

### Debug Commands

```bash
# Check connections
netstat -an | grep :8041

# Monitor Redis
redis-cli monitor

# Database connections
SELECT count(*) FROM pg_stat_activity;

# Application logs
journalctl -u brodcasta -f
```

## Support

- 📖 **[Documentation](./)** - Complete documentation
- 🐛 **[Issues](https://github.com/your-org/brodcasta/issues)** - Report bugs
- 💬 **[Discussions](https://github.com/your-org/brodcasta/discussions)** - Community support
