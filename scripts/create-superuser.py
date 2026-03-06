#!/usr/bin/env python3

import asyncio
import sys
from app.models.accounts import Account
from tortoise import Tortoise

async def create_superuser():
    try:
        await Tortoise.init(
            db_url='postgresql://brodcasta:brodcasta_password@postgres:5432/brodcasta', 
            modules={'app.models'}
        )
        await Tortoise.generate_schemas()
        
        if not await Account.filter(email='admin@brodcasta.dev').exists():
            await Account.create_superuser(
                email='admin@brodcasta.dev',
                password='admin123',
                full_name='Admin User'
            )
            print('Superuser created: admin@brodcasta.dev / admin123')
        else:
            print('Superuser already exists')
            
    except Exception as e:
        print(f'Error creating superuser: {e}')
        sys.exit(1)
    finally:
        await Tortoise.close_connections()

if __name__ == '__main__':
    asyncio.run(create_superuser())
