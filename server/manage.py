#!/usr/bin/env python3
"""
Management script for the Brodcasta server application.
Provides CLI commands for database management, migrations, and other administrative tasks.
"""

import click
import os
import sys

# Add the current directory to Python path so we can import our modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import CLI command groups
from cli.migrations import migrate
from cli.db import db


@click.group()
@click.version_option(version="0.1.0", prog_name="Brodcasta-server")
def cli():
    """Brodcasta Server Management CLI
    
    A command-line interface for managing the Brodcasta server application,
    including database operations, migrations, and other administrative tasks.
    """
    pass


# Add command groups
cli.add_command(migrate)
cli.add_command(db)


@cli.command()
def shell():
    """Open an interactive shell with the app context"""
    import asyncio
    from tortoise import Tortoise
    
    async def init_shell():
        from config import TORTOISE_ORM
        await Tortoise.init(config=TORTOISE_ORM)
        await Tortoise.generate_schemas()
        
        # Import models for easy access
        from models import Account
        
        print("Brodcasta Server Shell")
        print("Available models: Account")
        print("Database connection established")
        print("Type 'exit()' to quit")
        
        # Start interactive shell
        import code
        code.interact(local=globals())
        
        await Tortoise.close_connections()
    
    try:
        asyncio.run(init_shell())
    except KeyboardInterrupt:
        print("\nShell exited")
    except Exception as e:
        print(f"Error starting shell: {e}")
        sys.exit(1)


@cli.command()
@click.option('--host', default='127.0.0.1', help='Host to bind to')
@click.option('--port', default=8000, help='Port to bind to')
@click.option('--reload', is_flag=True, help='Enable auto-reload')
def runserver(host, port, reload):
    """Start the development server"""
    import uvicorn
    
    click.echo(f"Starting server on {host}:{port}")
    if reload:
        click.echo("Auto-reload enabled")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload
    )


if __name__ == '__main__':
    cli()
