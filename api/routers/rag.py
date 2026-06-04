from fastapi import APIRouter, Depends

from api.deps import get_db_connection
from api.schema import QuestionRequest, AnswerResponse
from RAG.llama3 import Llama3AnswerService

router = APIRouter()

@router.post("/ask", response_model=AnswerResponse)
def ask_question(
    request: QuestionRequest,
    db_connection = Depends(get_db_connection),
):
    service = Llama3AnswerService(
    chat_model="llama3",
    embedding_model="embeddinggemma",
    top_k=3,
    )
    
    with db_connection.session() as db:
        answer = service.answer(db, request.question)

    return AnswerResponse(answer=answer)
