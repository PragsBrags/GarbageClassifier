import os
import yaml
from pathlib import Path

from RAG.embeddings import EmbeddingService, generate_text
from RAG.llama3 import Llama3AnswerService
from database.connection import DatabaseConnection
from database.repository import ResultRepository
from ingestion.sampler import sampling
from ingestion.video_source import video_source
from services.inference.registry import build_inference_service

def load_config(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

script_dir = os.path.dirname(os.path.abspath(__file__))

def main():
    config_path = os.path.join(script_dir, "config", "config.yaml")
    config = load_config(config_path)
    predictions = {}

    db_connection = DatabaseConnection(config["database"])
    db_connection.create_tables()
    repo = ResultRepository()
    
    cap, filename = video_source(config["video"], project_root=script_dir)

    with db_connection.session() as db:
        if db is None:
            raise ValueError("Database session not initialized")
        repo.create_job(db, filename)

    inference_service = build_inference_service(
        model_name=config["pipeline"]["model"],
        config=config,
        project_root=script_dir,
    )
    
    for frames in sampling(cap, config):
        predictions = inference_service.predict(frames)
    
    text = generate_text(filename, predictions)
    embed_service = EmbeddingService()
    embed_data = embed_service.generate_embeddings(text)

    service = Llama3AnswerService(
    chat_model="llama3",
    embedding_model="embeddinggemma",
    top_k=3,
    )

    with db_connection.session() as db:
        if db is None:
            raise ValueError("Database session not initialized")
        for classification, count in predictions.items():
            repo.save_classification(db, filename, classification, count)
        repo.save_embeddings(db, filename, text, embed_data)
        answer = service.answer(db, "What would be an effective way to handle biodegradable garbage for the given readings?")
    print(answer)

    #print("Current Counts:", predictions)

if __name__ == "__main__":
    main()