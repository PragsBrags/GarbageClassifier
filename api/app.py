from pathlib import Path
from fastapi import FastAPI

from api.routers import detection, jobs, rag
from database.connection import DatabaseConnection
from database.repository import ResultRepository
from services.main import load_config, GarbageClassifierService

PROJECT_ROOT = Path(__file__).resolve().parents[1]
config_path = PROJECT_ROOT / "config" / "config.yaml"

def create_app() -> FastAPI:
    app = FastAPI(title="Garbage Detection API")

    config = load_config(config_path)
    db_connection = DatabaseConnection(config["database"])
    db_connection.create_tables()

    app.state.config = config
    app.state.db_connection = db_connection
    app.state.repository = ResultRepository()
    app.state.pipeline = GarbageClassifierService(config_path, db_connection, str(PROJECT_ROOT))

    app.include_router(detection.router, prefix="/detections", tags=["detections"])
    app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
    app.include_router(rag.router, prefix="/rag", tags=["rag"])

    return app

app = create_app()