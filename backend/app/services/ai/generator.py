"""
Geração de skins Roblox via DALL-E 3.

Fluxo:
  1. Enriquecer prompt PT-BR com contexto técnico Roblox
  2. Gerar imagem 1024×1024 via DALL-E 3
  3. Fazer download da imagem gerada
  4. Redimensionar + compor sobre template transparente 585×559px
  5. Retornar bytes PNG prontos para download ou upload

O template 585×559px é o padrão oficial do Roblox para roupas 2D.
"""

import io
import textwrap

import httpx
from openai import AsyncOpenAI
from PIL import Image

from app.core.config import settings

# Dimensões oficiais do template Roblox para roupas 2D
ROBLOX_WIDTH = 585
ROBLOX_HEIGHT = 559

# Área útil da textura dentro do template (excluindo margens de mapeamento UV)
_TEXTURE_REGION = (0, 0, ROBLOX_WIDTH, ROBLOX_HEIGHT)

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


def _build_dalle_prompt(user_prompt: str) -> str:
    """
    Converte o prompt do usuário em linguagem técnica para DALL-E 3
    gerar uma textura de roupa adequada ao template Roblox.
    """
    return textwrap.dedent(f"""
        Roblox clothing texture sheet, flat 2D game asset, T-pose character layout.
        Style: {user_prompt}.
        Requirements: front view shirt/clothing texture on a pure transparent/white background,
        pixel-perfect seams, vibrant colors, suitable for Roblox UGC marketplace,
        no text, no logos, no watermarks, clean edges.
        Format: flat clothing template spread, top-down view of fabric panels.
    """).strip()


async def generate_skin(prompt: str) -> tuple[bytes, str]:
    """
    Gera uma skin Roblox a partir de um prompt em português.

    Returns:
        (png_bytes, revised_prompt) — bytes do PNG 585×559px e o prompt
        revisado pelo DALL-E 3.

    Raises:
        ValueError: se a API retornar resposta inválida.
        httpx.HTTPError: se o download da imagem falhar.
    """
    client = _get_client()
    dalle_prompt = _build_dalle_prompt(prompt)

    response = await client.images.generate(
        model="dall-e-3",
        prompt=dalle_prompt,
        size="1024x1024",
        quality="standard",
        n=1,
        response_format="url",
    )

    image_data = response.data[0]
    image_url = image_data.url
    revised_prompt = image_data.revised_prompt or prompt

    if not image_url:
        raise ValueError("DALL-E 3 não retornou URL de imagem")

    png_bytes = await _download_and_resize(image_url)
    return png_bytes, revised_prompt


async def _download_and_resize(url: str) -> bytes:
    """
    Faz download da imagem gerada e redimensiona para o template Roblox 585×559px.
    Mantém proporção via letterbox com fundo branco (compatível com Roblox).
    """
    async with httpx.AsyncClient(timeout=30) as http:
        resp = await http.get(url)
        resp.raise_for_status()
        raw = resp.content

    with Image.open(io.BytesIO(raw)) as src:
        # Garante RGBA para suportar transparência
        src = src.convert("RGBA")

        # Redimensiona preservando proporção (fit inside 585×559)
        src.thumbnail((ROBLOX_WIDTH, ROBLOX_HEIGHT), Image.LANCZOS)

        # Cria canvas branco 585×559 e centraliza a imagem
        canvas = Image.new("RGBA", (ROBLOX_WIDTH, ROBLOX_HEIGHT), (255, 255, 255, 255))
        offset_x = (ROBLOX_WIDTH - src.width) // 2
        offset_y = (ROBLOX_HEIGHT - src.height) // 2
        canvas.paste(src, (offset_x, offset_y), mask=src)

        # Converte para RGB (PNG sem alpha, que o Roblox aceita)
        final = canvas.convert("RGB")

    buf = io.BytesIO()
    final.save(buf, format="PNG", optimize=True)
    return buf.getvalue()
