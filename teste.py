from RAG.embeddings import EmbeddingService

embed_service = EmbeddingService()
vector = embed_service.generate_embeddings("test text")
print(len(vector))