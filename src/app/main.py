from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, assets

app = FastAPI(
    title="NexusOps API Backend",
    description="API REST de gestion des actifs et incidents pour NexusOps",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS pour le frontend React
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
    return {"status": "ok", "service": "NexusOps API"}