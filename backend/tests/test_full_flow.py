"""
Testes de integração do fluxo completo (Issue #7):
prompt → DALL-E → preview → (opcional) Roblox upload.

Todas as dependências externas são mockadas.
"""

import io
import json
from unittest.mock import MagicMock, patch

from PIL import Image

from app.workers.skin_worker import DELIVERY_AUTOPUBLISH, DELIVERY_DOWNLOAD, process_skin


def _png_bytes() -> bytes:
    img = Image.new("RGB", (585, 559), color=(80, 120, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


class TestFullFlowDownload:
    def test_download_mode_does_not_call_publisher(self):
        png = _png_bytes()
        mock_redis = MagicMock()

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "revised")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
            patch("app.workers.skin_worker.publish_skin") as mock_publish,
        ):
            process_skin("job-dl", "jaqueta azul", delivery_mode=DELIVERY_DOWNLOAD)

        mock_publish.assert_not_called()

    def test_download_mode_stores_correct_meta(self):
        png = _png_bytes()
        mock_redis = MagicMock()

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "rev-dl")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
        ):
            process_skin("job-dl-meta", "cape branca", delivery_mode=DELIVERY_DOWNLOAD)

        meta_call = mock_redis.set.call_args_list[1]
        meta = json.loads(meta_call.args[1])
        assert meta["delivery_mode"] == DELIVERY_DOWNLOAD
        assert "asset_id" not in meta
        assert "marketplace_url" not in meta

    def test_download_mode_result_has_done_status(self):
        png = _png_bytes()
        mock_redis = MagicMock()

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "rev")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
        ):
            result = process_skin("job-status", "armor", delivery_mode=DELIVERY_DOWNLOAD)

        assert result["status"] == "done"


class TestFullFlowAutopublish:
    def test_autopublish_mode_calls_publisher(self):
        png = _png_bytes()
        mock_redis = MagicMock()

        mock_pub_result = MagicMock()
        mock_pub_result.asset_id = 99999
        mock_pub_result.marketplace_url = "https://www.roblox.com/catalog/99999"

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "revised")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
            patch("app.workers.skin_worker.publish_skin", return_value=mock_pub_result) as mock_pub,
        ):
            process_skin(
                "job-ap",
                "jaqueta ouro",
                delivery_mode=DELIVERY_AUTOPUBLISH,
                skin_name="Jaqueta Ouro",
                skin_description="Top tier",
            )

        mock_pub.assert_called_once_with(png, "Jaqueta Ouro", "Top tier")

    def test_autopublish_meta_contains_asset_info(self):
        png = _png_bytes()
        mock_redis = MagicMock()

        mock_pub_result = MagicMock()
        mock_pub_result.asset_id = 12345
        mock_pub_result.marketplace_url = "https://www.roblox.com/catalog/12345"

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "rev-ap")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
            patch("app.workers.skin_worker.publish_skin", return_value=mock_pub_result),
        ):
            process_skin("job-ap-meta", "vest neon", delivery_mode=DELIVERY_AUTOPUBLISH)

        meta_call = mock_redis.set.call_args_list[1]
        meta = json.loads(meta_call.args[1])
        assert meta["delivery_mode"] == DELIVERY_AUTOPUBLISH
        assert meta["asset_id"] == 12345
        assert meta["marketplace_url"] == "https://www.roblox.com/catalog/12345"

    def test_autopublish_result_contains_asset_id(self):
        png = _png_bytes()
        mock_redis = MagicMock()

        mock_pub_result = MagicMock()
        mock_pub_result.asset_id = 77777
        mock_pub_result.marketplace_url = "https://www.roblox.com/catalog/77777"

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "rev")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
            patch("app.workers.skin_worker.publish_skin", return_value=mock_pub_result),
        ):
            result = process_skin("job-ap-res", "hoodie verde", delivery_mode=DELIVERY_AUTOPUBLISH)

        assert result["asset_id"] == 77777
        assert "roblox.com/catalog/77777" in result["marketplace_url"]


class TestAPIFullFlow:
    def test_generate_autopublish_passes_delivery_mode(self):
        from fastapi.testclient import TestClient

        from app.main import app

        mock_redis = MagicMock()
        mock_queue = MagicMock()
        mock_queue.enqueue.return_value = MagicMock(id="ap-job-id")

        with (
            patch("app.api.skins.get_redis", return_value=mock_redis),
            patch("app.api.skins._get_queue", return_value=mock_queue),
        ):
            client = TestClient(app)
            resp = client.post(
                "/skins/generate",
                json={
                    "prompt": "jaqueta dourada épica",
                    "delivery_mode": "autopublish",
                    "skin_name": "Jaqueta Épica",
                    "skin_description": "Skin top",
                },
            )

        assert resp.status_code == 202
        data = resp.json()
        assert data["delivery_mode"] == "autopublish"

        enqueue_kwargs = mock_queue.enqueue.call_args.kwargs["kwargs"]
        assert enqueue_kwargs["delivery_mode"] == "autopublish"
        assert enqueue_kwargs["skin_name"] == "Jaqueta Épica"

    def test_status_exposes_marketplace_url_when_done(self):
        from fastapi.testclient import TestClient
        from rq.job import JobStatus

        from app.main import app

        png = _png_bytes()
        meta = json.dumps(
            {
                "prompt": "vest roxa",
                "revised_prompt": "revised",
                "delivery_mode": "autopublish",
                "asset_id": 55555,
                "marketplace_url": "https://www.roblox.com/catalog/55555",
            }
        )

        mock_redis = MagicMock()
        mock_redis.get.side_effect = lambda key: meta.encode() if "meta" in key else png

        mock_job = MagicMock()
        mock_job.get_status.return_value = JobStatus.FINISHED

        with (
            patch("app.api.skins.get_redis", return_value=mock_redis),
            patch("app.api.skins.Job.fetch", return_value=mock_job),
        ):
            client = TestClient(app)
            resp = client.get("/skins/some-job/status")

        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "done"
        assert data["asset_id"] == 55555
        assert data["marketplace_url"] == "https://www.roblox.com/catalog/55555"
        assert data["preview_base64"] is not None
