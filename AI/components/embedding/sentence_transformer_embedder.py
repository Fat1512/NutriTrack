from sentence_transformers import SentenceTransformer
from components.interfaces import Embedding
from typing import List
import os

class SentenceTransformerEmbedder(Embedding):
    def __init__(self):
        model_name = os.getenv("EMBEDDING_MODEL_NAME")
        print(f"Loading embedding model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        print("Embedding model loaded.")

    def vectorize(self, content: List[str]) -> List[List[float]]:
        if not content:
            return []
        
        return self.model.encode(content).tolist()