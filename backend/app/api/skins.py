"""
Endpoints de geração e download de skins.

POST /skins/generate  → dispara geração assíncrona (enfileira job)
GET  /skins/{id}      → status do job + URL de preview
GET  /skins/{id}/download → retorna PNG 585×559px
"""

import base64
import uuid

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

from app.services.ai.generator import generate_skin

router = APIRouter(prefix="/skins", tags=["skins"])


class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=3, max_length=300, examples=["jaqueta streetwear roxa com raios"])


class GenerateResponse(BaseModel):
    job_id: str
    prompt: str
    revised_prompt: str
    preview_base64: str  # PNG em base64 para preview imediato no frontend


@router.post("/generate", response_model=GenerateResponse, status_code=201)
async def generate(body: GenerateRequest) -> GenerateResponse:
    """
    Gera uma skin Roblox a partir de um prompt em português.

    Versão MVP: geração síncrona (< 30s). Issues #5/#7 adicionarão
    a fila Redis + RQ para processamento assíncrono escalável.
    """
    try:
        png_bytes, revised_prompt = await generate_skin(body.prompt)
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Falha na geração da imagem") from exc

    job_id = str(uuid.uuid4())
    preview_b64 = base64.b64encode(png_bytes).decode()

    return GenerateResponse(
        job_id=job_id,
        prompt=body.prompt,
        revised_prompt=revised_prompt,
        preview_base64=preview_b64,
    )


@router.get("/{job_id}/download", response_class=Response)
async def download(job_id: str) -> Response:
    """
    Placeholder: retorna o PNG do job.
    Implementação completa em issue #7 (persistência no storage).
    """
    raise HTTPException(status_code=404, detail="Job não encontrado. Implemente persistência no issue #7.")
