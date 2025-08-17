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
        assert job["state"] == "completed"
        job_id = job["job_id"]

        # 2. GET /jobs/{job_id}
        resp2 = await ac.get(f"/jobs/{job_id}")
        assert resp2.status_code == 200
        job2 = resp2.json()
        assert job2["state"] == "completed"
        assert job2["job_id"] == job_id

        # 3. GET /jobs/{job_id}/artifacts
        resp3 = await ac.get(f"/jobs/{job_id}/artifacts")
        assert resp3.status_code == 200
        result = resp3.json()
        assert "scalars" in result
        assert "E_total_hartree" in result["scalars"]
