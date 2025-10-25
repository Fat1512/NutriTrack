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
import pandas as pd
from components.manager import EmbeddingManager, DatabaseManager
import os, json
from datetime import datetime
from service.history_service import RedisHistoryService

class NutritionService:
    def __init__(self, csv_path="data/ingredients_metadata.csv"):
        self.df = pd.read_csv(csv_path)
        self.embedder = EmbeddingManager()
        
        self.db = DatabaseManager()
        self.collection_name = "nutrition_ingredients"
        self.redis_logger = RedisHistoryService()

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
        from service.guardrail_service import FoodGuardrailService

        results = {}
        redis_logger = self.redis_logger
        guardrail = FoodGuardrailService()

        candidate_pairs = []
        raw_results = {}

        for ing in ingredients:
            matches = self.find_similar(ing)
            if matches:
                raw_results[ing] = matches
                candidate_pairs.append({
                    "ingredient": ing,
                    "matched": matches[0]["ingr"]
                })
            else:
                raw_results[ing] = []

        check_result = guardrail.check_valid_batch_with_gpt(candidate_pairs)

        for ing, matches in raw_results.items():
            if not matches:
                self._log_missing(redis_logger, ing)
                results[ing] = []
                continue

            db_ing_name = matches[0]["ingr"]
            if check_result.get(ing, False):
                results[ing] = matches
            else:
                self._log_missing(redis_logger, ing)
                results[ing] = []

        return results


    @staticmethod
    def _log_missing(redis_logger, ing):
        try:
            if redis_logger.is_available:
                entry = {"ingredient": ing, "timestamp": datetime.now().isoformat()}
                redis_logger.client.lpush(
                    "nutrition:missing_ingredients",
                    json.dumps(entry, ensure_ascii=False)
                )
                redis_logger.client.expire("nutrition:missing_ingredients", redis_logger.ttl)
                print(f"[WARN] Logged missing ingredient to Redis: {ing}")
            else:
                print(f"[WARN] Redis unavailable — cannot log {ing}")
        except Exception as e:
            print(f"[ERROR] Failed to log {ing}: {e}")
