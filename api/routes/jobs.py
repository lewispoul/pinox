import uuid
from fastapi import APIRouter, HTTPException
from api.schemas.job import JobRequest, JobStatus
from api.schemas.result import ResultBundle

router = APIRouter()
JOBS = {}

@router.post("/jobs", response_model=JobStatus)
def create_job(req: JobRequest):
    job_id = uuid.uuid4().hex
    JOBS[job_id] = {"state": "completed", "message": "", "result": {
        "scalars": {"E_total_hartree": -1.0, "gap_eV": 5.0, "dipole_D": 0.0},
        "series": {},
        "artifacts": []
    }}
    return JobStatus(job_id=job_id, state="completed")

@router.get("/jobs/{job_id}", response_model=JobStatus)
def get_job(job_id: str):
    j = JOBS.get(job_id)
    if not j:
        raise HTTPException(404, "Job not found")
    return JobStatus(job_id=job_id, state=j["state"], message=j.get("message", ""))

@router.get("/jobs/{job_id}/artifacts", response_model=ResultBundle)
def get_artifacts(job_id: str):
    j = JOBS.get(job_id)
    if not j or j["state"] != "completed":
        raise HTTPException(404, "Result not available")
    rb = j["result"]
    return ResultBundle(**rb)
