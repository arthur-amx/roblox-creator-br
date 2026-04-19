"""
Testes unitários do serviço de geração de skins.
A chamada ao DALL-E 3 e o download HTTP são mockados.
"""

import io
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from PIL import Image

from app.services.ai.generator import (
    ROBLOX_HEIGHT,
    ROBLOX_WIDTH,
    _build_dalle_prompt,
    _download_and_resize,
    generate_skin,
)


def _make_png_bytes(width: int = 1024, height: int = 1024) -> bytes:
    img = Image.new("RGB", (width, height), color=(120, 80, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


class TestBuildDallePrompt:
    def test_contains_user_prompt(self):
        result = _build_dalle_prompt("jaqueta roxa com raios")
        assert "jaqueta roxa com raios" in result

    def test_contains_roblox_keywords(self):
        result = _build_dalle_prompt("qualquer coisa")
        assert "Roblox" in result
        assert "clothing texture" in result

    def test_no_empty_prompt(self):
        result = _build_dalle_prompt("")
        assert len(result) > 20


class TestDownloadAndResize:
    @pytest.mark.asyncio
    async def test_output_is_correct_size(self):
        png_input = _make_png_bytes(1024, 1024)

        with patch("httpx.AsyncClient") as mock_client_cls:
            mock_resp = MagicMock()
            mock_resp.content = png_input
            mock_resp.raise_for_status = MagicMock()

            mock_client = AsyncMock()
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client.get = AsyncMock(return_value=mock_resp)
            mock_client_cls.return_value = mock_client

            result = await _download_and_resize("https://fake-url/image.png")

        img = Image.open(io.BytesIO(result))
        assert img.width == ROBLOX_WIDTH
        assert img.height == ROBLOX_HEIGHT

    @pytest.mark.asyncio
    async def test_output_is_png(self):
        png_input = _make_png_bytes(512, 512)

        with patch("httpx.AsyncClient") as mock_client_cls:
            mock_resp = MagicMock()
            mock_resp.content = png_input
            mock_resp.raise_for_status = MagicMock()

            mock_client = AsyncMock()
            mock_client.__aenter__ = AsyncMock(return_value=mock_client)
            mock_client.__aexit__ = AsyncMock(return_value=False)
            mock_client.get = AsyncMock(return_value=mock_resp)
            mock_client_cls.return_value = mock_client

            result = await _download_and_resize("https://fake-url/image.png")

        assert result[:4] == b"\x89PNG"


class TestGenerateSkin:
    @pytest.mark.asyncio
    async def test_returns_png_bytes_and_prompt(self):
        png_input = _make_png_bytes()

        mock_image_data = MagicMock()
        mock_image_data.url = "https://fake-dalle-url/image.png"
        mock_image_data.revised_prompt = "revised: jaqueta roxa"

        mock_response = MagicMock()
        mock_response.data = [mock_image_data]

        with (
            patch("app.services.ai.generator._get_client") as mock_get_client,
            patch("app.services.ai.generator._download_and_resize", new_callable=AsyncMock) as mock_dl,
        ):
            mock_openai = AsyncMock()
            mock_openai.images.generate = AsyncMock(return_value=mock_response)
            mock_get_client.return_value = mock_openai
            mock_dl.return_value = png_input

            png_bytes, revised = await generate_skin("jaqueta roxa com raios")

        assert png_bytes == png_input
        assert revised == "revised: jaqueta roxa"

    @pytest.mark.asyncio
    async def test_raises_on_missing_url(self):
        mock_image_data = MagicMock()
        mock_image_data.url = None
        mock_image_data.revised_prompt = None

        mock_response = MagicMock()
        mock_response.data = [mock_image_data]

        with patch("app.services.ai.generator._get_client") as mock_get_client:
            mock_openai = AsyncMock()
            mock_openai.images.generate = AsyncMock(return_value=mock_response)
            mock_get_client.return_value = mock_openai

            with pytest.raises(ValueError, match="não retornou URL"):
                await generate_skin("qualquer prompt")
