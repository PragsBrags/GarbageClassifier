from fastapi import Request

def get_config(request: Request):
    return request.app.state.config

def get_db_connection(request: Request):
    return request.app.state.db_connection

def get_repository(request: Request):
    return request.app.state.repository

def get_pipeline(request: Request):
    return request.app.state.pipeline