import pytest
from httpx import AsyncClient
from httpx import ASGITransport
from api.main import app

@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/health")
        assert resp.status_code == 200
        assert resp.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_jobs_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. POST /jobs
        job_req = {
            "engine": "xtb",
            "kind": "opt_properties",
            "inputs": {
                "xyz": "2\nH2\nH 0 0 0\nH 0 0 0.74\n",
                "charge": 0,
                "multiplicity": 1
            }
        }
        resp = await ac.post("/jobs", json=job_req)
        assert resp.status_code == 200
        job = resp.json()
        assert "job_id" in job
        assert job["state"] == "pending"  # Job is now queued with Dramatiq
        job_id = job["job_id"]

        # 2. GET /jobs/{job_id}
        resp2 = await ac.get(f"/jobs/{job_id}")
        assert resp2.status_code == 200
        job2 = resp2.json()
        assert job2["state"] == "pending"  # Job remains pending until Dramatiq worker processes it
        assert job2["job_id"] == job_id

        # 3. GET /jobs/{job_id}/artifacts - Should return 404 for pending jobs
        resp3 = await ac.get(f"/jobs/{job_id}/artifacts")
        assert resp3.status_code == 404  # No artifacts for pending jobs
        result = resp3.json()
        assert result["detail"] == "Result not available"  # Expected error message
