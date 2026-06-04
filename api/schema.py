from typing import Dict, Literal
from pydantic import BaseModel

class JobResponse(BaseModel):
    job_id: str
    status: Literal["queued", "running", "completed", "failed"]

class DetectionResult(BaseModel):
    job_id: str
    filename: str
    counts: Dict[str, int]

class QuestionRequest(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str