from pathlib import Path

from fastapi import APIRouter, Depends, File, BackgroundTasks, UploadFile

from api.deps import get_pipeline
from api.schema import JobResponse

router = APIRouter()

UPLOAD_DIR = Path("uploads")
JOB_STATUS = {}

@router.post("/video", response_model=JobResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    pipeline = Depends(get_pipeline)
):
    UPLOAD_DIR.mkdir(exist_ok=True)

    file_path = UPLOAD_DIR / f"{file.filename}"
    file_path.write_bytes(await file.read())

    JOB_STATUS[file.filename] = "queued"

    background_tasks.add_task(run_detection_job, pipeline, file.filename, file_path)

    return JobResponse(job_id=file.filename, status="queued")

def run_detection_job(pipeline, job_id: str, file_path: Path):
    try:
        JOB_STATUS[job_id] = "running"
        pipeline.run_inference()
        JOB_STATUS[job_id] = "completed"
    except Exception:
        JOB_STATUS[job_id] = "failed"
        raise

