from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase

class Base(DeclarativeBase):
    pass

class IngestionDetails(Base):
    __tablename__ = "ingestion_details"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ingestion_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False, unique=True)
    uploaded_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    job: Mapped[list["ClassificationCount"]] = relationship(back_populates="ingestion_details")

class ClassificationCount(Base):
    __tablename__ = "classification_count"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ingestion_id: Mapped[str] = mapped_column(String(64), ForeignKey("ingestion_details.ingestion_id"), index=True)
    classification: Mapped[str] = mapped_column(String(64), nullable=False)
    count: Mapped[int] = mapped_column(Integer, default=0)

    ingestion_details: Mapped[IngestionDetails] = relationship(back_populates="job")