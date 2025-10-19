from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        print(f"Loading embedding model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        print("Embedding model loaded.")

    def get_embedding(self, text: str):
        return self.model.encode(text).tolist()

    def get_embeddings(self, texts: list):
        return self.model.encode(texts).tolist()