from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import create_db_and_tables

app = FastAPI(
    title=settings.app_name,
    description="API para geração e publicação de skins no Roblox via IA",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/health", tags=["infra"])
def health_check():
    return {"status": "ok", "environment": settings.environment}
