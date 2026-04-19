"""
Testes unitários do serviço de publicação Roblox (Issue #6).
As chamadas à Open Cloud API são mockadas.
"""

import io
from unittest.mock import MagicMock, patch

import pytest

from app.services.roblox.publisher import PublishResult, publish_skin


def _png_bytes() -> bytes:
    return b"\x89PNG\r\n\x1a\n" + b"\x00" * 100


class TestPublishSkin:
    def test_returns_publish_result(self):
        mock_asset = MagicMock()
        mock_asset.id = 987654321

        mock_operation = MagicMock()
        mock_operation.wait.return_value = mock_asset

        mock_creator = MagicMock()
        mock_creator.upload_asset.return_value = mock_operation

        with (
            patch("app.services.roblox.publisher._get_creator", return_value=mock_creator),
            patch("app.services.roblox.publisher.settings") as mock_settings,
        ):
            mock_settings.roblox_api_key = "test-key"
            mock_settings.roblox_creator_id = "123456"

            result = publish_skin(_png_bytes(), "Jaqueta Roxa", "Skin gerada por IA")

        assert isinstance(result, PublishResult)
        assert result.asset_id == 987654321
        assert "987654321" in result.marketplace_url
        assert result.marketplace_url.startswith("https://www.roblox.com/catalog/")

    def test_upload_called_with_correct_params(self):
        import rblxopencloud

        mock_asset = MagicMock()
        mock_asset.id = 111

        mock_operation = MagicMock()
        mock_operation.wait.return_value = mock_asset

        mock_creator = MagicMock()
        mock_creator.upload_asset.return_value = mock_operation

        png = _png_bytes()

        with (
            patch("app.services.roblox.publisher._get_creator", return_value=mock_creator),
            patch("app.services.roblox.publisher.settings") as mock_settings,
        ):
            mock_settings.roblox_api_key = "test-key"
            mock_settings.roblox_creator_id = "123"

            publish_skin(png, "Armor Medieval", "Descrição")

        call_kwargs = mock_creator.upload_asset.call_args.kwargs
        assert call_kwargs["name"] == "Armor Medieval"
        assert call_kwargs["description"] == "Descrição"
        assert call_kwargs["asset_type"] == rblxopencloud.AssetType.Decal
        assert isinstance(call_kwargs["file"], io.BytesIO)

    def test_raises_when_credentials_missing(self):
        with patch("app.services.roblox.publisher.settings") as mock_settings:
            mock_settings.roblox_api_key = ""
            mock_settings.roblox_creator_id = ""

            with pytest.raises(ValueError, match="ROBLOX_API_KEY"):
                publish_skin(_png_bytes(), "Nome", "Desc")

    def test_wait_uses_timeout_90s(self):
        mock_asset = MagicMock()
        mock_asset.id = 222

        mock_operation = MagicMock()
        mock_operation.wait.return_value = mock_asset

        mock_creator = MagicMock()
        mock_creator.upload_asset.return_value = mock_operation

        with (
            patch("app.services.roblox.publisher._get_creator", return_value=mock_creator),
            patch("app.services.roblox.publisher.settings") as mock_settings,
        ):
            mock_settings.roblox_api_key = "key"
            mock_settings.roblox_creator_id = "1"

            publish_skin(_png_bytes(), "Test", "Desc")

        mock_operation.wait.assert_called_once_with(
            timeout_seconds=90,
            interval_seconds=2,
            interval_exponent=1.3,
        )
