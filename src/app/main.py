from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import get_password_hash
from app.database import db_users, db_assets
from app.routers import auth, assets, incidents, users
from app.schemas import AssetResponse

app = FastAPI(
    title="NexusOps API Backend",
    description="API REST de gestion des actifs et incidents pour NexusOps",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(assets.router)
app.include_router(incidents.router)
app.include_router(users.router)


def seed() -> None:
    """Données de démo (la base est en mémoire, elle est vide à chaque redémarrage)."""
    if not db_users:
        db_users["1"] = {
            "id": "1",
            "username": "admin",
            "email": "admin@nexusops.local",
            "role": "admin",
            "password": get_password_hash("admin123"),
        }
    if not db_assets:
        db_assets["1"] = AssetResponse(id="1", name="SRV-PAR-01", site="Paris", ip_address="10.0.0.1")
        db_assets["2"] = AssetResponse(id="2", name="FW-LYO-01", site="Lyon", ip_address="10.0.1.1")


seed()


@app.get("/", tags=["Healthcheck"])
async def root():
    return {"status": "ok", "service": "NexusOps API"}