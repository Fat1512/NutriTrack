from abc import ABC, abstractmethod
from typing import List, Set

class Generator(ABC):
    @abstractmethod
    def generate(self, prompt: str, images: List[str] = None):
        pass


class Embedding(ABC):
    @abstractmethod
    def vectorize(self, content: List[str]):
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
              query_embeddings: List[List[float]], 
              n_results: int) -> dict:
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