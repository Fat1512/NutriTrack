import chromadb
from typing import List, Dict, Any
from components.interfaces import VectorDatabase

class ChromaDB(VectorDatabase):
    def __init__(self):
        self.client = chromadb.Client()
        self._collections = {}
        print("ChromaDB implementation initialized.")

    def _get_collection(self, collection_name: str):
        if collection_name not in self._collections:
            self._collections[collection_name] = self.client.get_or_create_collection(
                name=collection_name
            )
        return self._collections[collection_name]

    def add(self, 
            collection_name: str, 
            ids: List[str], 
            embeddings: List[List[float]], 
            documents: List[str], 
            metadatas: List[dict]):
        
        collection = self._get_collection(collection_name)
        collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    def query(self, 
              collection_name: str, 
              query_embeddings: List[List[float]], 
              n_results: int):
        
        collection = self._get_collection(collection_name)
        return collection.query(
            query_embeddings=query_embeddings,
            n_results=n_results
        )

    def delete(self, 
               collection_name: str, 
               where_filter: dict):
        
        collection = self._get_collection(collection_name)
        collection.delete(where=where_filter)

    def count(self, collection_name: str) -> int:
        collection = self._get_collection(collection_name)
        return collection.count()

    def get_unique_metadata_values(self, 
                                     collection_name: str, 
                                     metadata_field: str):
        
        collection = self._get_collection(collection_name)
        data = collection.get(include=["metadatas"])
        
        unique_values = set()
        metadatas = data.get('metadatas', [])
        
        for metadata in metadatas:
            if metadata_field in metadata:
                unique_values.add(metadata[metadata_field])
                
        return unique_values