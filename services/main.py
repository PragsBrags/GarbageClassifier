import os
import yaml
from pathlib import Path

from RAG.embeddings import EmbeddingService, generate_text
from database.connection import DatabaseConnection
from database.repository import ResultRepository
from ingestion.sampler import sampling
from ingestion.video_source import video_source
from services.inference.registry import build_inference_service


def load_config(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

class GarbageClassifierService:
    def __init__(self, config_path: str, db_connection: DatabaseConnection, script_dir: str):
        self.config = load_config(config_path)
        self.repo = ResultRepository()
        self.db_connection = db_connection
        self.script_dir = script_dir
        self.inference_service = build_inference_service(
            model_name=self.config["pipeline"]["model"],
            config=self.config,
            project_root=script_dir,
        )

    def run_inference(self):
        cap, filename = video_source(self.config["video"], project_root=self.script_dir)
        predictions = {}

        with self.db_connection.session() as db:
            if db is None:
                raise ValueError("Database session not initialized")
            self.repo.create_job(db, filename)

        inference_service = build_inference_service(
            model_name=self.config["pipeline"]["model"],
            config=self.config,
            project_root=self.script_dir,
        )
        
        for frames in sampling(cap, self.config):
            predictions = inference_service.predict(frames)
        
        text = generate_text(filename, predictions)
        embed_service = EmbeddingService()
        embed_data = embed_service.generate_embeddings(text)

        

        with self.db_connection.session() as db:
            if db is None:
                raise ValueError("Database session not initialized")
            for classification, count in predictions.items():
                self.repo.save_classification(db, filename, classification, count)
            self.repo.save_embeddings(db, filename, text, embed_data)

        return {
            "filename": filename,
            "model": self.config["pipeline"]["model"],
            "predictions": predictions,
        }
