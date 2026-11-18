from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, assets
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

app = FastAPI(
    title="NexusOps API Backend",
    description="API REST de gestion des actifs et incidents pour NexusOps",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(assets.router)

@app.get("/", tags=["Healthcheck"])
async def root():
    return {"status":"ok", "message":"NexusOps API is running"}
    router = APIRouter()

@router.get("/test-db")
def test_database_connection(db: Session = Depends(get_db)):
    try:
        # Exécute une requête simple pour tester la connexion
        result = db.execute(text("SELECT NOW();")).fetchone()
        return {
            "status": "success",
            "message": "Connexion à Supabase réussie !",
            "server_time": result[0]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Échec de la connexion : {str(e)}"
        }