from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models.job import Job, JobStatus
from database import get_db

router = APIRouter()

@router.post("/jobs")
def create_job(name: str, db: Session = get_db()):
    job = Job(name=name)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/jobs")
def list_jobs(db: Session = get_db()):
    return db.query(Job).all()

@router.get("/jobs/{job_id}")
def get_job(job_id: int, db: Session = get_db()):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/jobs/{job_id}")
def update_job(job_id: int, status: JobStatus, db: Session = get_db()):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.status = status
    db.commit()
    db.refresh(job)
    return job
