import uuid
from fastapi import APIRouter, HTTPException
from api.schemas.job import JobRequest, JobStatus
from api.schemas.result import ResultBundle, Artifact
from api.services.storage import job_dir
from api.services.queue import broker  # noqa: F401
import dramatiq
from ai.runners.xtb import run_xtb_job

router = APIRouter()
JOBS = {}  # { job_id: {"state": str, "message": str, "result": dict|None} }

@dramatiq.actor
def run_job(job_id: str, req_json: str):
    """Dramatiq actor to execute XTB calculations"""
    try:
        JR = JobRequest.model_validate_json(req_json)
        JOBS[job_id]["state"] = "running"
        JOBS[job_id]["message"] = "XTB calculation in progress"
        
        jd = job_dir(job_id)
        result = run_xtb_job(
            jd,
            JR.inputs.xyz,
            JR.inputs.charge,
            JR.inputs.multiplicity,
            JR.inputs.params.model_dump(),
        )
        
        # Store result and update state
        JOBS[job_id]["result"] = result
        # XTB success: return code 0 OR (return code 2 with valid energy results)
        has_energy = result.get("scalars", {}).get("E_total_hartree") is not None
        success = (result.get("returncode") == 0) or (result.get("returncode") == 2 and has_energy)
        
        if success:
            JOBS[job_id]["state"] = "completed"
            JOBS[job_id]["message"] = "XTB calculation completed successfully"
        else:
            JOBS[job_id]["state"] = "failed"  
            JOBS[job_id]["message"] = f"XTB calculation failed with return code {result.get('returncode')}"
            
    except Exception as e:
        JOBS[job_id]["state"] = "failed"
        JOBS[job_id]["message"] = str(e)

@router.post("/jobs", response_model=JobStatus)
def create_job(req: JobRequest):
    """Create a new XTB job and queue it for processing"""
    job_id = uuid.uuid4().hex
    JOBS[job_id] = {"state": "pending", "message": "Job queued for processing", "result": None}
    run_job.send(job_id, req.model_dump_json())
    return JobStatus(job_id=job_id, state="pending", message="Job queued for processing")

@router.get("/jobs/{job_id}", response_model=JobStatus)
def get_job(job_id: str):
    """Get job status and current state"""
    j = JOBS.get(job_id)
    if not j:
        raise HTTPException(404, "Job not found")
    return JobStatus(job_id=job_id, state=j["state"], message=j.get("message", ""))

@router.get("/jobs/{job_id}/artifacts", response_model=ResultBundle)
def get_artifacts(job_id: str):
    """Get job results and artifacts if calculation is completed"""
    j = JOBS.get(job_id)
    if not j or j["state"] != "completed" or j["result"] is None:
        raise HTTPException(404, "Result not available")
    
    rb = j["result"]
    
    # Convert dict artifacts to Artifact objects for proper validation
    artifacts = []
    for art_dict in rb.get("artifacts", []):
        artifacts.append(Artifact(**art_dict))
    
    return ResultBundle(
        scalars=rb.get("scalars", {}), 
        series=rb.get("series", {}), 
        artifacts=artifacts
    )
