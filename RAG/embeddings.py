from datetime import datetime, date
from langchain_ollama import OllamaEmbeddings

def generate_text(filename, predictions):
    parts = [f"Video file {filename} contains detected garbage items. Detected on {date.today()} at {datetime.now().time()}."]

    for classification, count in sorted(predictions.items()):
        parts.append(f"It contains {count} {classification.lower()} item(s).")

    return " ".join(parts)

class EmbeddingService:
    def __init__(self):
        self.embeddings_obj = OllamaEmbeddings(model = "embeddinggemma:latest")

    def generate_embeddings(self, text):
        db_embeddings = self.embeddings_obj.embed_query(text)
        return db_embeddings