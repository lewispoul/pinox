from __future__ import annotations
import os
import threading
import time
from typing import Dict, Any
from .jobs_store import get_store


# Simple demo work; replace with real task kinds
def echo_worker(payload: Dict[str, Any]) -> Dict[str, Any]:
    time.sleep(0.05)
    return {"echo": payload}


def submit_job(kind: str, payload: Dict[str, Any]) -> str:
    store = get_store()
    job = store.create()
    job_id = job.id

    # Check Redis URL dynamically to support test monkeypatching
    redis_url = os.getenv("REDIS_URL")
    if redis_url:
        # Publish to Dramatiq actor; worker will update Redis-backed store
        # We import inside to avoid dramatiq dep at import time in CI
        from workers.jobs_worker import enqueue_job
        enqueue_job.send(job_id, kind, payload)
        return job_id

    # Local thread mode for CI or dev without Redis
    def _runner():
        try:
            store.set_state(job_id, "running")
            if kind == "echo":
                result = echo_worker(payload)
            elif kind == "xtb":
                # For local mode, run XTB calculation directly
                result = run_xtb_calculation_local(payload)
            else:
                result = {"echo": payload}
            store.set_state(job_id, "done", result=result)
        except Exception as e:  # noqa: BLE001
            store.set_state(job_id, "failed", error=str(e))

    threading.Thread(target=_runner, daemon=True).start()
    return job_id


def run_xtb_calculation_local(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Run XTB calculation locally in thread mode"""
    from api.schemas.job import JobRequest
    from api.services.storage import job_dir
    from ai.runners.xtb import run_xtb_job
    
    # Parse the job request
    job_request_json = payload.get("job_request", "{}")
    try:
        JR = JobRequest.model_validate_json(job_request_json)
    except Exception as e:
        raise ValueError(f"Invalid job request: {e}")
    
    job_id = payload.get("job_id", "unknown")
    jd = job_dir(job_id)
    
    result = run_xtb_job(
        jd,
        JR.inputs.xyz,
        JR.inputs.charge,
        JR.inputs.multiplicity,
        JR.inputs.params.model_dump(),
    )
    
    # XTB success: return code 0 OR (return code 2 with valid energy results)
    has_energy = result.get("scalars", {}).get("E_total_hartree") is not None
    success = ((result.get("returncode") == 0) or
               (result.get("returncode") == 2 and has_energy))
    
    if not success:
        error_msg = f"XTB calculation failed with return code {result.get('returncode')}"
        raise RuntimeError(error_msg)
    
    return result
