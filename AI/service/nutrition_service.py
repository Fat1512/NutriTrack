import sys
import pandas as pd
from .embedding_service import EmbeddingService
import pysqlite3
sys.modules["sqlite3"] = pysqlite3
import chromadb

class NutritionService:
    def __init__(self, csv_path="data/ingredients_metadata.csv"):
        self.df = pd.read_csv(csv_path)
        self.embedder = EmbeddingService()
        self.chroma_client = chromadb.Client() 
        self.collection = self.chroma_client.get_or_create_collection(name="nutrition_ingredients")
        
        if self.collection.count() == 0:
            print("Indexing data to Chroma DB...")
            self._prepare_data()
            print("Chroma DB indexing complete.")

    def _prepare_data(self):
        ids = [str(i) for i in self.df['id'].tolist()]
        documents = self.df['ingr'].tolist() 
        
        embeddings = self.embedder.get_embeddings(documents)
        
        metadatas = self.df.drop(columns=['ingr']).to_dict('records')

        self.collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
    def find_similar(self, ingredient, limit=3):
        query_vector = self.embedder.get_embedding(ingredient)

        results = self.collection.query(
            query_embeddings=[query_vector],
            n_results=limit
        )

        final_results = []
        if results and results['metadatas'] and results['metadatas'][0]:
            for metadata in results['metadatas'][0]:
                if metadata:
                    ingr_id = metadata['id']
                    matched_row = self.df[self.df["id"] == ingr_id].iloc[0].to_dict()
                    final_results.append(matched_row)
        
        return final_results
    
    def find_for_list(self, ingredients):
        results = {}
        for ing in ingredients:
            matches = self.find_similar(ing)
            if matches:
                results[ing] = matches
        return results