import os
import requests
from components.interfaces import Embedding
from typing import List

class OllamaEmbedder(Embedding):
    def __init__(self):
        self.host = os.getenv("OLLAMA_HOST")
        self.model = os.getenv("EMBEDDING_MODEL_NAME")
        
        if not self.host:
            raise ValueError("OLLAMA_HOST environment variable not set.")
        if not self.model:
            raise ValueError("EMBEDDING_MODEL_NAME environment variable not set for Ollama.")
        
        print(f"Initializing OllamaEmbedding with model: {self.model} at {self.host}")

    def vectorize(self, content: List[str]) -> List[List[float]]:
        if not content:
            return []

        embeddings = []
        try:
            for text in content:
                payload = {
                    "model": self.model,
                    "prompt": text,
                    "stream": False 
                }
                res = requests.post(f"{self.host}/api/embeddings", json=payload, timeout=60)
                res.raise_for_status()
                
                embedding_data = res.json()
                if "embedding" in embedding_data:
                    embeddings.append(embedding_data["embedding"])
                else:
                    print(f"Warning: No embedding returned for text: {text[:50]}...")
                    embeddings.append([]) 
            
            return embeddings

        except Exception as e:
            print(f"[Ollama Embedding Error] {e}")
            return [[] for _ in content]