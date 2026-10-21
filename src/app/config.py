import os

SECRET_KEY = os.getenv("SECRET_KEY", "nexusops_super_secret_jwt_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60