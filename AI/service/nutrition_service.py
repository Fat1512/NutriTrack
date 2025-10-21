import sys
import pandas as pd
from components.manager import EmbeddingManager, DatabaseManager

class NutritionService:
    def __init__(self, csv_path="data/ingredients_metadata.csv"):
        self.df = pd.read_csv(csv_path)
        self.embedder = EmbeddingManager()
        
        self.db = DatabaseManager()
        self.collection_name = "nutrition_ingredients"

        if self.db.count(self.collection_name) == 0:
            print("Indexing data to Chroma DB...")
            self._prepare_data()
            print("Chroma DB indexing complete.")

    def _prepare_data(self):
        ids = [str(i) for i in self.df['id'].tolist()]
        documents = self.df['ingr'].tolist()
        embeddings = self.embedder.vectorize(documents)
        metadatas = self.df.drop(columns=['ingr']).to_dict('records')

        self.db.add(
            collection_name=self.collection_name,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
    def find_similar(self, ingredient, limit=3):
        query_vector = self.embedder.vectorize_single(ingredient)

        results = self.db.query(
            collection_name=self.collection_name,
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