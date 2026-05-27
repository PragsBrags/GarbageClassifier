from sqlalchemy.orm import Session

from database.models import ClassificationCount, IngestionDetails, TextEmbeddings

class ResultRepository:
    def create_job(self, db: Session, ingestion_id:str) -> IngestionDetails :
        existing = db.query(IngestionDetails).filter_by(ingestion_id=ingestion_id).one_or_none()

        if existing:
            return existing

        row = IngestionDetails(
            ingestion_id=ingestion_id,
        )
        db.add(row)
        db.flush()
        return row

    def save_classification(self, db:Session, ingestion_id:str, classification:str, count:int) -> None:
        row = ClassificationCount(
            ingestion_id=ingestion_id,
            classification=classification,
            count=count,
        )
        db.add(row)
        db.flush()

    def save_embeddings(self, db:Session, ingestion_id:str, text:str, embeddings:dict) -> None:
        row = TextEmbeddings(
            ingestion_id=ingestion_id,
            text=text,
            embeddings=embeddings,
        )
        db.add(row)
        db.flush()
