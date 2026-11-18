import os

SECRET_KEY = os.getenv("SECRET_KEY", "nexusops_super_secret_jwt_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

SUPABASE_URL = "https://daiofjgpbpenngcmebb.supabase.co"
DATABASE_URL = "postgresql+psycopg2://postgres:H3Cw9tAtI6VStjcP@db.daiofjgpbpenngcmebb.supabase.co:5432/postgres"
