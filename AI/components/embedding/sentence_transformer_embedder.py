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