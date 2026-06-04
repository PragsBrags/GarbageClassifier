from fastapi import APIRouter, Depends, HTTPException

from database.repository import ResultRepository
from api.deps import get_db_connection, get_repository
from api.routers.detection import JOB_STATUS

router = APIRouter()

@router.get("/{job_id}")
def get_job(job_id: str):
    status = JOB_STATUS.get(job_id)

    if status is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"job_id": job_id, "status": status}


@router.get("/{job_id}/counts")
def get_job_counts(
    job_id: str,
    db_connection = Depends(get_db_connection),
    repository = Depends(get_repository),
):
    repository = ResultRepository()
    with db_connection.session() as db:
        counts = repository.get_counts(db, job_id)

    return {"job_id": job_id, "counts": counts}