import os
import dotenv
dotenv.load_dotenv()
from urllib.parse import quote

user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT", 5432)
database = os.getenv("DB_NAME")

# Encode username and password
user = quote(user)
password = quote(password)

DB_URL = f"postgres://{user}:{password}@{host}:{port}/{database}"
print(DB_URL)

# Tortoise ORM Configuration
TORTOISE_ORM = {
    "connections": {
        "default": DB_URL
    },
    "apps": {
        "models": {
            "models": ["models", "aerich.models"],
            "default_connection": "default",
        }
    },
    "use_tz": False,
    "timezone": "UTC"
}