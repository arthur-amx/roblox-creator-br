"""
Testes unitários do worker de geração de skins (Issue #5).
Redis e generate_skin são mockados — sem dependências externas.
"""

import io
import json
from unittest.mock import MagicMock, patch

from PIL import Image


def _make_png_bytes() -> bytes:
    img = Image.new("RGB", (585, 559), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


class TestProcessSkin:
    def test_stores_png_in_redis(self):
        png = _make_png_bytes()
        mock_redis = MagicMock()

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "revised prompt")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
        ):
            from app.workers.skin_worker import process_skin

            process_skin("job-abc", "jaqueta roxa")

        png_call = mock_redis.set.call_args_list[0]
        assert png_call.args[0] == "job:job-abc:png"
        assert png_call.args[1] == png

    def test_stores_meta_in_redis(self):
        png = _make_png_bytes()
        mock_redis = MagicMock()

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "revised prompt")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
        ):
            from app.workers.skin_worker import process_skin

            process_skin("job-abc", "jaqueta roxa")

        meta_call = mock_redis.set.call_args_list[1]
        assert meta_call.args[0] == "job:job-abc:meta"
        meta = json.loads(meta_call.args[1])
        assert meta["prompt"] == "jaqueta roxa"
        assert meta["revised_prompt"] == "revised prompt"

    def test_returns_done_status(self):
        png = _make_png_bytes()
        mock_redis = MagicMock()

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "revised")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
        ):
            from app.workers.skin_worker import process_skin

            result = process_skin("job-xyz", "armor medieval")

        assert result["status"] == "done"
        assert result["revised_prompt"] == "revised"

    def test_ttl_is_set(self):
        png = _make_png_bytes()
        mock_redis = MagicMock()

        with (
            patch("app.workers.skin_worker.asyncio.run", return_value=(png, "rev")),
            patch("app.workers.skin_worker.get_redis", return_value=mock_redis),
        ):
            from app.workers.skin_worker import process_skin

            process_skin("job-ttl", "teste")

        for call in mock_redis.set.call_args_list:
            assert call.kwargs.get("ex") == 86_400


class TestSkinsEndpoints:
    def test_generate_enqueues_job(self):
        from fastapi.testclient import TestClient

        from app.main import app

        mock_redis = MagicMock()
        mock_queue = MagicMock()
        mock_queue.enqueue.return_value = MagicMock(id="test-job-id")

        with (
            patch("app.api.skins.get_redis", return_value=mock_redis),
            patch("app.api.skins._get_queue", return_value=mock_queue),
        ):
            client = TestClient(app)
            resp = client.post("/skins/generate", json={"prompt": "jaqueta azul"})

        assert resp.status_code == 202
        data = resp.json()
        assert "job_id" in data
        assert data["status"] == "queued"
        mock_queue.enqueue.assert_called_once()

    def test_generate_rejects_short_prompt(self):
        from fastapi.testclient import TestClient

        from app.main import app

        mock_redis = MagicMock()
        mock_queue = MagicMock()

        with (
            patch("app.api.skins.get_redis", return_value=mock_redis),
            patch("app.api.skins._get_queue", return_value=mock_queue),
        ):
            client = TestClient(app)
            resp = client.post("/skins/generate", json={"prompt": "ab"})

        assert resp.status_code == 422

    def test_download_returns_404_when_missing(self):
        from fastapi.testclient import TestClient

        from app.main import app

        mock_redis = MagicMock()
        mock_redis.get.return_value = None

        with patch("app.api.skins.get_redis", return_value=mock_redis):
            client = TestClient(app)
            resp = client.get("/skins/nonexistent-id/download")

        assert resp.status_code == 404

    def test_download_returns_png_when_present(self):
        from fastapi.testclient import TestClient

        from app.main import app

        png = _make_png_bytes()
        mock_redis = MagicMock()
        mock_redis.get.return_value = png

        with patch("app.api.skins.get_redis", return_value=mock_redis):
            client = TestClient(app)
            resp = client.get("/skins/some-job-id/download")

        assert resp.status_code == 200
        assert resp.headers["content-type"] == "image/png"
        assert resp.content == png
