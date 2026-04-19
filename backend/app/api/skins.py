"""
Endpoints de geração e download de skins.

POST /skins/generate          → enfileira job e retorna job_id (HTTP 202)
GET  /skins/{job_id}/status   → status do job (queued | started | done | failed)
GET  /skins/{job_id}/download → retorna PNG 585×559px
"""

import base64
import json
import uuid
from typing import Literal

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
from redis import Redis
from rq import Queue
from rq.job import Job, JobStatus

from app.core.redis import get_redis
from app.workers.skin_worker import DELIVERY_AUTOPUBLISH, process_skin

router = APIRouter(prefix="/skins", tags=["skins"])

_QUEUE_NAME = "skins"
# autopublish exige mais tempo: DALL-E (≤30s) + upload Roblox (≤90s)
_JOB_TIMEOUT_AUTOPUBLISH = 150
_JOB_TIMEOUT_DOWNLOAD = 120


def _get_queue(r: Redis) -> Queue:
    return Queue(_QUEUE_NAME, connection=r)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------


class GenerateRequest(BaseModel):
    prompt: str = Field(
        ..., min_length=3, max_length=300, examples=["jaqueta streetwear roxa com raios"]
    )
    delivery_mode: Literal["download", "autopublish"] = Field(
        default="download",
        description="'download' retorna PNG (1 token). 'autopublish' publica direto no Roblox (2 tokens).",
    )
    skin_name: str = Field(
        default="Skin Roblox",
        max_length=50,
        description="Nome do asset no Roblox (usado apenas em autopublish).",
    )
    skin_description: str = Field(
        default="Skin gerada por IA — Roblox Creator BR",
        max_length=200,
        description="Descrição do asset no Roblox (usado apenas em autopublish).",
    )


class GenerateResponse(BaseModel):
    job_id: str
    status: str  # "queued"
    delivery_mode: str


class StatusResponse(BaseModel):
    job_id: str
    status: str  # queued | started | done | failed
    delivery_mode: str | None = None
    prompt: str | None = None
    revised_prompt: str | None = None
    preview_base64: str | None = None  # presente quando status == "done"
    asset_id: int | None = None  # presente quando delivery_mode == "autopublish"
    marketplace_url: str | None = None  # presente quando delivery_mode == "autopublish"
    error: str | None = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post("/generate", response_model=GenerateResponse, status_code=202)
def generate(body: GenerateRequest) -> GenerateResponse:
    """
    Enfileira geração de skin Roblox a partir de um prompt em português.

    - delivery_mode=download  → 1 token, PNG disponível em /{job_id}/download
    - delivery_mode=autopublish → 2 tokens, skin publicada direto no Roblox
    """
    r = get_redis()
    q = _get_queue(r)
    job_id = str(uuid.uuid4())
    timeout = (
        _JOB_TIMEOUT_AUTOPUBLISH
        if body.delivery_mode == DELIVERY_AUTOPUBLISH
        else _JOB_TIMEOUT_DOWNLOAD
    )

    q.enqueue(
        process_skin,
        job_id=job_id,
        kwargs={
            "job_id": job_id,
            "prompt": body.prompt,
            "delivery_mode": body.delivery_mode,
            "skin_name": body.skin_name,
            "skin_description": body.skin_description,
        },
        job_timeout=timeout,
        result_ttl=86_400,
        failure_ttl=86_400,
    )

    return GenerateResponse(job_id=job_id, status="queued", delivery_mode=body.delivery_mode)


@router.get("/{job_id}/status", responses={404: {"description": "Job não encontrado"}})
def job_status(job_id: str) -> StatusResponse:
    """Retorna o status atual do job e, quando concluído, o preview e dados do Roblox."""
    r = get_redis()

    try:
        job = Job.fetch(job_id, connection=r)
    except Exception as exc:
        raise HTTPException(status_code=404, detail="Job não encontrado") from exc

    rq_status = job.get_status()

    if rq_status == JobStatus.FINISHED:
        meta_raw = r.get(f"job:{job_id}:meta")
        png_raw = r.get(f"job:{job_id}:png")
        meta = json.loads(meta_raw) if meta_raw else {}
        preview_b64 = base64.b64encode(png_raw).decode() if png_raw else None
        return StatusResponse(
            job_id=job_id,
            status="done",
            delivery_mode=meta.get("delivery_mode"),
            prompt=meta.get("prompt"),
            revised_prompt=meta.get("revised_prompt"),
            preview_base64=preview_b64,
            asset_id=meta.get("asset_id"),
            marketplace_url=meta.get("marketplace_url"),
        )

    if rq_status == JobStatus.FAILED:
        return StatusResponse(
            job_id=job_id,
            status="failed",
            error=str(job.exc_info) if job.exc_info else "Erro desconhecido",
        )

    status_map = {
        JobStatus.QUEUED: "queued",
        JobStatus.STARTED: "started",
        JobStatus.DEFERRED: "queued",
        JobStatus.SCHEDULED: "queued",
        JobStatus.STOPPED: "failed",
        JobStatus.CANCELED: "failed",
    }
    return StatusResponse(job_id=job_id, status=status_map.get(rq_status, "queued"))


@router.get(
    "/{job_id}/download",
    response_class=Response,
    responses={404: {"description": "PNG não encontrado"}},
)
def download(job_id: str) -> Response:
    """Retorna o PNG 585×559px gerado para o job informado."""
    r = get_redis()
    png_bytes = r.get(f"job:{job_id}:png")
    if not png_bytes:
        raise HTTPException(
            status_code=404,
            detail="PNG não encontrado. Job ainda em processamento ou expirado.",
        )
    return Response(
        content=png_bytes,
        media_type="image/png",
        headers={"Content-Disposition": f'attachment; filename="skin-{job_id}.png"'},
    )
