#!/usr/bin/env python3


from models.accounts import Account,Role
import os
DB_USER = os.getenv('DB_USER', 'brodcasta')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'brodcasta_password')
DB_HOST = os.getenv('DB_HOST', 'postgres')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'brodcasta')
async def create_superuser():
    try:
       
        if await Account.filter(role=Role.ADMIN).exists():
            print('Superuser already exists')
            return
        await Account.create_user(
            email='admin@brodcasta.dev',
            password='admin123',
            name='Admin User',
            role=Role.ADMIN
        )
        print('Superuser created: admin@brodcasta.dev / admin123')
       
            
    except Exception as e:
        print(f'Error creating superuser: {e}')
        