"""
RQ worker job: fluxo completo prompt → DALL-E 3 → preview → (opcional) Roblox upload.

Modos de entrega (delivery_mode):
  "download"    → gera PNG e armazena no Redis para download direto (1 token)
  "autopublish" → gera PNG, faz upload no Roblox e armazena asset_id (2 tokens)

Chaves Redis utilizadas:
  job:{job_id}:png   → bytes PNG 585×559px  (TTL 24h)
  job:{job_id}:meta  → JSON com campos do resultado  (TTL 24h)
"""

import asyncio
import json

from app.core.redis import get_redis
from app.services.ai.generator import generate_skin
from app.services.roblox.publisher import publish_skin

_TTL = 86_400

DELIVERY_DOWNLOAD = "download"
DELIVERY_AUTOPUBLISH = "autopublish"


def process_skin(
    job_id: str,
    prompt: str,
    delivery_mode: str = DELIVERY_DOWNLOAD,
    skin_name: str = "Skin Roblox",
    skin_description: str = "Skin gerada por IA — Roblox Creator BR",
) -> dict:
    """
    Ponto de entrada do job RQ.

    Args:
        job_id: UUID do job (também usado como chave Redis).
        prompt: prompt PT-BR do usuário.
        delivery_mode: "download" ou "autopublish".
        skin_name: nome do asset no Roblox (usado apenas em autopublish).
        skin_description: descrição do asset (usado apenas em autopublish).

    Returns:
        dict com status, revised_prompt e (se autopublish) asset_id + marketplace_url.
    """
    png_bytes, revised_prompt = asyncio.run(generate_skin(prompt))

    r = get_redis()
    r.set(f"job:{job_id}:png", png_bytes, ex=_TTL)

    meta: dict = {
        "prompt": prompt,
        "revised_prompt": revised_prompt,
        "delivery_mode": delivery_mode,
    }

    if delivery_mode == DELIVERY_AUTOPUBLISH:
        result = publish_skin(png_bytes, skin_name, skin_description)
        meta["asset_id"] = result.asset_id
        meta["marketplace_url"] = result.marketplace_url

    r.set(f"job:{job_id}:meta", json.dumps(meta), ex=_TTL)

    return {"status": "done", "revised_prompt": revised_prompt, **meta}
