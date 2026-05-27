from langchain_ollama import ChatOllama, OllamaEmbeddings
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models import TextEmbeddings


class Llama3AnswerService:
    def __init__(
        self,
        chat_model: str = "llama3",
        embedding_model: str = "embeddinggemma",
        top_k: int = 3,
    ):
        self.top_k = top_k
        self.embedder = OllamaEmbeddings(model=embedding_model)
        self.llm = ChatOllama(model=chat_model, temperature=0)

    def retrieve_context(self, db: Session, question: str) -> list[TextEmbeddings]:
        question_vector = self.embedder.embed_query(question)

        stmt = (
            select(TextEmbeddings)
            .order_by(TextEmbeddings.embeddings.cosine_distance(question_vector))
            .limit(self.top_k)
        )

        return db.scalars(stmt).all()

    def answer(self, db: Session, question: str) -> str:
        rows = self.retrieve_context(db, question)

        if not rows:
            return "I do not have any stored classification context yet."

        context = "\n\n".join(
            f"Ingestion ID: {row.ingestion_id}\n{row.text}"
            for row in rows
        )

        response = self.llm.invoke([
            (
                "system",
                "You answer questions about garbage classification results. "
                "Use only the provided context. If the answer is not in the context, say so briefly.",
            ),
            (
                "human",
                f"Context:\n{context}\n\nQuestion:\n{question}",
            ),
        ])

        return response.content