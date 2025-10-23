# Copyright 2025 NutriTrack
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
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