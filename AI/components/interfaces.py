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
from abc import ABC, abstractmethod
from typing import List, Set, Optional
from pathlib import Path
import asyncio



class Generator(ABC):
    @abstractmethod
    def generate(self, prompt: str, images: List[str] = None):
        pass


class Embedding(ABC):
    @abstractmethod
    def vectorize(self, content: List[str]):
        pass


class BaseIngestStrategy(ABC):
    @abstractmethod
    def get_supported_extensions(self) -> list[str]:
        pass

    def can_handle(self, filename: str) -> bool:
        ext = Path(filename).suffix.lower()
        return ext in self.get_supported_extensions()


class BaseWatcher(ABC):
    @abstractmethod
    async def start(self, rag_service, loop):
        pass


class VectorDatabase(ABC):
    @abstractmethod
    def add(self, 
            collection_name: str, 
            ids: List[str], 
            embeddings: List[List[float]], 
            documents: List[str], 
            metadatas: List[dict]):
        pass

    @abstractmethod
    def query(self, 
              collection_name: str, 
              query_embeddings: Optional[List[List[float]]] = None, 
              where_document_filter: Optional[dict] = None,
              n_results: int = 3) -> dict:
        pass

    @abstractmethod
    def delete(self, 
               collection_name: str, 
               where_filter: dict) -> None:
        pass

    @abstractmethod
    def count(self, collection_name: str) -> int:
        pass

    @abstractmethod
    def get_unique_metadata_values(self, 
                                   collection_name: str, 
                                   metadata_field: str) -> Set[str]:
        pass

    @abstractmethod
    def get_all(self, 
                collection_name: str, 
                include: List[str] = ["metadatas", "documents"]) -> dict:
        pass