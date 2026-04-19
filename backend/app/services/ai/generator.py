"""
Geração de skins Roblox via DALL-E 3.

Fluxo:
  1. Enriquecer prompt PT-BR → DALL-E 3 gera design frontal 1024×1024
  2. Download da imagem gerada
  3. Mapear o design para o UV layout oficial do template Roblox 585×559px
  4. Retornar bytes PNG prontos para download ou upload

O mapeamento UV divide o design em regiões (frente/costas/lados/mangas)
e as posiciona exatamente nos painéis do template Roblox, garantindo
que as costuras fiquem corretas no personagem 3D.
"""

import io
import textwrap

import httpx
from openai import AsyncOpenAI
from PIL import Image

from app.core.config import settings

# Dimensões oficiais do template Roblox para roupas 2D (shirt/pants)
ROBLOX_WIDTH = 585
ROBLOX_HEIGHT = 559

# ---------------------------------------------------------------------------
# Regiões UV do template Roblox (x1, y1, x2, y2) — coordenadas em pixels
# Fonte: template oficial https://create.roblox.com/store/asset/14820226
# ---------------------------------------------------------------------------

# Torso — os 4 lados do tronco
_T_FRONT = (98, 2, 195, 107)  # frente do torso   97×105 px
_T_BACK = (196, 2, 293, 107)  # costas do torso   97×105 px
_T_R_SIDE = (2, 2, 97, 107)  # lado direito       95×105 px
_T_L_SIDE = (294, 2, 341, 107)  # lado esquerdo      47×105 px

# Braço direito
_RA_FRONT = (344, 2, 390, 58)  # frente manga dir  46×56 px
_RA_BACK = (390, 2, 436, 58)  # costas manga dir  46×56 px
_RA_BOTTOM = (344, 57, 390, 106)  # base manga dir    46×49 px

# Braço esquerdo
_LA_FRONT = (436, 2, 482, 58)  # frente manga esq  46×56 px
_LA_BACK = (482, 2, 528, 58)  # costas manga esq  46×56 px
_LA_BOTTOM = (436, 57, 482, 106)  # base manga esq    46×49 px

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


def _build_dalle_prompt(user_prompt: str) -> str:
    """
    Gera prompt otimizado para DALL-E 3 produzir um design de roupa frontal
    em T-pose — fundo branco, mangas abertas, sem fundo nem sombra.
    O resultado será mapeado programaticamente sobre o template UV do Roblox.
    """
    return textwrap.dedent(f"""
        A flat 2D clothing texture panel for a Roblox shirt, front view, T-pose.
        Style: {user_prompt}.

        Technical requirements (STRICT):
        - T-pose layout: collar at top-center, both sleeves fully extended horizontally
        - Pure WHITE background, zero shadows, zero gradients, zero 3D effects
        - Crisp pixel-perfect edges on collar, hem, and sleeve cuffs
        - No human body visible — fabric only, as if the shirt is lying flat
        - No text, no logos, no brand names, no watermarks
        - Vivid, saturated colors — design must pop on a white background
        - The design should wrap naturally from front to sides (seamless side edges)
        - Single shirt front panel; do NOT include a back view in the same image
    """).strip()


def _apply_roblox_template(design: Image.Image) -> Image.Image:
    """
    Mapeia um design de roupa (front-view, T-pose) para o UV layout oficial
    do template Roblox 585×559px.

    Lógica de mapeamento (design 1024×1024 → regiões do template):
      - Centro horizontal  → frente e costas do torso
      - Borda direita (manga) → painéis do braço direito
      - Borda esquerda (manga) → painéis do braço esquerdo
      - Bordas verticais    → tiras laterais do torso
    """
    src = design.convert("RGBA")
    w, h = src.size

    canvas = Image.new("RGBA", (ROBLOX_WIDTH, ROBLOX_HEIGHT), (255, 255, 255, 255))

    def _paste(dest: tuple, src_frac: tuple, flip_h: bool = False) -> None:
        """Recorta src em coordenadas fracionárias (0–1), redimensiona e cola."""
        fx1, fy1, fx2, fy2 = src_frac
        crop = src.crop((int(fx1 * w), int(fy1 * h), int(fx2 * w), int(fy2 * h)))
        dx1, dy1, dx2, dy2 = dest
        crop = crop.resize((dx2 - dx1, dy2 - dy1), Image.LANCZOS)
        if flip_h:
            crop = crop.transpose(Image.FLIP_LEFT_RIGHT)
        canvas.paste(crop, (dx1, dy1), mask=crop)

    # -- Torso ---------------------------------------------------------------
    # Frente: faixa central do design (15%–85% da largura, topo)
    _paste(_T_FRONT, (0.15, 0.0, 0.85, 0.90))
    # Costas: espelho horizontal da frente
    _paste(_T_BACK, (0.15, 0.0, 0.85, 0.90), flip_h=True)
    # Lado direito: borda direita do design (tecido lateral)
    _paste(_T_R_SIDE, (0.70, 0.0, 1.00, 0.90))
    # Lado esquerdo: borda esquerda (espelhada para continuidade)
    _paste(_T_L_SIDE, (0.00, 0.0, 0.30, 0.90), flip_h=True)

    # -- Braço direito (manga direita do design) ------------------------------
    _paste(_RA_FRONT, (0.72, 0.0, 1.00, 0.50))
    _paste(_RA_BACK, (0.72, 0.0, 1.00, 0.50), flip_h=True)
    _paste(_RA_BOTTOM, (0.72, 0.5, 1.00, 0.90))

    # -- Braço esquerdo (manga esquerda do design) ----------------------------
    _paste(_LA_FRONT, (0.00, 0.0, 0.28, 0.50), flip_h=True)
    _paste(_LA_BACK, (0.00, 0.0, 0.28, 0.50))
    _paste(_LA_BOTTOM, (0.00, 0.5, 0.28, 0.90), flip_h=True)

    return canvas


async def generate_skin(prompt: str) -> tuple[bytes, str]:
    """
    Gera uma skin Roblox a partir de um prompt em português.

    Returns:
        (png_bytes, revised_prompt) — bytes do PNG 585×559px mapeado no
        template UV do Roblox, e o prompt revisado pelo DALL-E 3.

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
    Faz download do design gerado pelo DALL-E 3, mapeia para o template
    UV oficial do Roblox (585×559px) e retorna PNG RGB.
    """
    async with httpx.AsyncClient(timeout=30) as http:
        resp = await http.get(url)
        resp.raise_for_status()
        raw = resp.content

    with Image.open(io.BytesIO(raw)) as src:
        canvas = _apply_roblox_template(src)
        final = canvas.convert("RGB")

    buf = io.BytesIO()
    final.save(buf, format="PNG", optimize=True)
    return buf.getvalue()
