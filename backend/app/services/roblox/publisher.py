"""
Publicação de assets no Roblox via Open Cloud API.

Fluxo:
  1. Recebe PNG bytes (585×559px) + metadados da skin
  2. Faz upload como Decal via rblx-open-cloud
  3. Aguarda conclusão da operação (polling com exponential backoff)
  4. Retorna asset_id e marketplace_url do Roblox

Referência: https://create.roblox.com/docs/cloud/reference/assets
"""

import io

import rblxopencloud

from app.core.config import settings

_creator: rblxopencloud.Creator | None = None


def _get_creator() -> rblxopencloud.Creator:
    global _creator
    if _creator is None:
        _creator = rblxopencloud.Creator(
            id=int(settings.roblox_creator_id),
            api_key=settings.roblox_api_key,
            type="User",
        )
    return _creator


class PublishResult:
    def __init__(self, asset_id: int, marketplace_url: str) -> None:
        self.asset_id = asset_id
        self.marketplace_url = marketplace_url


def publish_skin(png_bytes: bytes, name: str, description: str) -> PublishResult:
    """
    Faz upload de uma skin PNG para o Roblox como Decal.

    Args:
        png_bytes: bytes do PNG 585×559px gerado pelo DALL-E 3.
        name: nome do asset (aparece no marketplace).
        description: descrição curta do asset.

    Returns:
        PublishResult com asset_id e marketplace_url.

    Raises:
        rblxopencloud.HttpException: falha na chamada à API do Roblox.
        TimeoutError: operação não concluída em 90 segundos.
        ValueError: configuração do Roblox ausente.
    """
    if not settings.roblox_api_key or not settings.roblox_creator_id:
        raise ValueError("ROBLOX_API_KEY e ROBLOX_CREATOR_ID são obrigatórios para auto-publish")

    creator = _get_creator()
    file_obj = io.BytesIO(png_bytes)

    operation = creator.upload_asset(
        file=file_obj,
        asset_type=rblxopencloud.AssetType.Decal,
        name=name,
        description=description,
        expected_robux_price=0,
    )

    asset: rblxopencloud.Asset = operation.wait(
        timeout_seconds=90,
        interval_seconds=2,
        interval_exponent=1.3,
    )

    asset_id = asset.id
    marketplace_url = f"https://www.roblox.com/catalog/{asset_id}"
    return PublishResult(asset_id=asset_id, marketplace_url=marketplace_url)
