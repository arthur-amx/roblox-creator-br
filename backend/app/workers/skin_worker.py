"""
RQ worker job: gera skin via DALL-E 3 e persiste resultado no Redis.

Chaves Redis utilizadas:
  job:{job_id}:png   → bytes PNG 585×559px  (TTL 24h)
  job:{job_id}:meta  → JSON com prompt + revised_prompt  (TTL 24h)
"""

import asyncio
import json

from app.core.redis import get_redis
from app.services.ai.generator import generate_skin

# 24 horas em segundos
_TTL = 86_400


def process_skin(job_id: str, prompt: str) -> dict:
    """
    Ponto de entrada do job RQ.
    Executa geração assíncrona de forma síncrona e armazena resultado no Redis.
    Returns dict com status e revised_prompt (RQ serializa como job result).
    """
    png_bytes, revised_prompt = asyncio.run(generate_skin(prompt))

    r = get_redis()
    r.set(f"job:{job_id}:png", png_bytes, ex=_TTL)
    r.set(
        f"job:{job_id}:meta",
        json.dumps({"prompt": prompt, "revised_prompt": revised_prompt}),
        ex=_TTL,
    )

    return {"status": "done", "revised_prompt": revised_prompt}
