.PHONY: help build dev prod clean logs stop

# Default target
help:
	@echo "Brodcasta Docker Commands:"
	@echo ""
	@echo "  build     - Build all Docker images"
	@echo "  dev       - Start development environment"
	@echo "  prod      - Start production environment"
	@echo "  logs      - Show logs for all services"
	@echo "  stop      - Stop all services"
	@echo "  clean     - Remove containers and volumes"
	@echo "  migrate   - Run database migrations"
	@echo "  test      - Run tests"
	@echo ""

# Build all images
build:
	@echo "Building Docker images..."
	docker compose build --no-cache

# Development environment
dev:
	@echo "Starting development environment..."
	docker compose up -d
	@echo "Services starting at:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8041"
	@echo "  Database: localhost:5432"
	@echo "  Redis:    localhost:6379"

# Production environment
prod:
	@echo "Starting production environment..."
	docker compose up -d
	@echo "Services starting at:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8041"

# Show logs
logs:
	docker compose logs -f

# Show logs for specific service
logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f postgres

logs-redis:
	docker compose logs -f redis

# Stop services
stop:
	@echo "Stopping all services..."
	docker compose down

# Clean up
clean:
	@echo "Removing containers and volumes..."
	docker compose down -v
	docker system prune -f

# Database migrations
migrate:
	@echo "Running database migrations..."
	docker compose exec backend aerich upgrade

# Create superuser
createsuperuser:
	@echo "Creating superuser..."
	docker compose exec backend python scripts/create-superuser.py

# Run tests
test:
	@echo "Running tests..."
	docker compose exec backend pytest

# Development shell
shell-backend:
	docker compose exec backend bash

shell-db:
	docker compose exec postgres psql -U brodcasta -d brodcasta

shell-redis:
	docker compose exec redis redis-cli

# Reset database
reset-db:
	@echo "Resetting database..."
	docker compose down postgres
	docker volume rm brodcasta_postgres_data
	docker compose up -d postgres
	sleep 5
	$(MAKE) migrate

# Backup database
backup-db:
	@echo "Creating database backup..."
	docker compose exec postgres pg_dump -U brodcasta brodcasta > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Restore database
restore-db:
	@echo "Restoring database from backup..."
	@read -p "Enter backup file: " backup_file; \
	docker compose exec -T postgres psql -U brodcasta brodcasta < $$backup_file

# Update dependencies
update-deps:
	@echo "Updating dependencies..."
	docker compose exec backend pip install -r requirements.txt
	docker compose exec frontend npm update
