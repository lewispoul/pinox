import uuid
import dramatiq
from fastapi import APIRouter, HTTPException
from api.schemas.job import JobRequest, JobStatus
from api.schemas.result import ResultBundle
from api.services.queue import broker  # Import broker
from api.services.storage import job_dir
from ai.runners.xtb import run_xtb_job
import json
from pathlib import Path

router = APIRouter()
JOBS = {}

@dramatiq.actor
def process_xtb_job(job_id: str, req_dict: dict):
    """Actor Dramatiq pour traiter les jobs XTB en arrière-plan"""
    try:
        JOBS[job_id] = {"state": "running", "message": "XTB calculation in progress", "result": None}
        
        # Récupérer les paramètres
        inputs = req_dict["inputs"]
        xyz = inputs["xyz"]
        charge = inputs.get("charge", 0)
        multiplicity = inputs.get("multiplicity", 1)
        params = inputs.get("params", {})
        
        # Dossier de job
        job_folder = job_dir(job_id)
        
        # Exécuter XTB
        result = run_xtb_job(job_folder, xyz, charge, multiplicity, params)
        
        # Stocker le résultat
        JOBS[job_id] = {
            "state": "completed" if result.get("returncode") == 0 else "failed",
            "message": "XTB calculation completed" if result.get("returncode") == 0 else "XTB calculation failed",
            "result": {
                "scalars": result.get("scalars", {}),
                "series": result.get("series", {}),
                "artifacts": result.get("artifacts", [])
            }
        }
        
    except Exception as e:
        JOBS[job_id] = {"state": "failed", "message": f"Error: {str(e)}", "result": None}

@router.post("/jobs", response_model=JobStatus)
def create_job(req: JobRequest):
    job_id = uuid.uuid4().hex
    JOBS[job_id] = {"state": "pending", "message": "Job queued for processing", "result": None}
    
    # Envoyer à la queue Dramatiq
    process_xtb_job.send(job_id, req.model_dump())
    
    return JobStatus(job_id=job_id, state="pending", message="Job queued for processing")

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
