from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.skins import router as skins_router
from app.core.config import settings
from app.core.database import create_db_and_tables


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    create_db_and_tables()
    yield


app = FastAPI(
    title=settings.app_name,
    description="API para geração e publicação de skins no Roblox via IA",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(skins_router)


@app.get("/health", tags=["infra"])
def health_check():
    return {"status": "ok", "environment": settings.environment}
