# Use Python 3.11 slim image
FROM python:latest
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=7012

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/


# Set work directory
WORKDIR /app

# Copy project files
COPY pyproject.toml uv.lock ./
COPY README.md ./

RUN uv sync --frozen --no-cache


# Copy the rest of the app

COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# Run migrations (Aerich)
RUN uv run aerich migrate || true
RUN uv run aerich upgrade || true

# Expose port
EXPOSE 7012

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7012/health || exit 1

# Start the application via UV
CMD ["uv", "run", "main.py"]