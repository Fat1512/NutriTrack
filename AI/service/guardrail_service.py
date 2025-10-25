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
from components.manager import GenerationManager, PromptManager
from typing import List, Dict, Any, Tuple

class FoodGuardrailService:
    @staticmethod
    def check_is_food(detected_data: Dict[str, Any], token_usage: Dict[str, int]) -> Tuple[bool, Dict[str, Any]]:
        if not detected_data.get("is_food"):
            print("Guardrail triggered: Image was determined not to be food.")
            return False, {
                "dish_name": "Not food",
                "detected_ingredients": [],
                "nutrition_per_ingredient": {},
                "total_nutrition": {},
                "token_usage": token_usage
            }
        
        if not detected_data.get("ingredients"):
            print("Guardrail triggered: Image is food, but no ingredients were detected.")
            return False, {
                "dish_name": detected_data.get("dish_name", "Unknown dish"),
                "detected_ingredients": [],
                "nutrition_per_ingredient": {},
                "total_nutrition": {},
                "token_usage": token_usage
            }
            
        return True, {}

    @staticmethod
    def check_valid_batch_with_gpt(pairs: list) -> dict:
        from components.manager import GenerationManager
        import json

        if not pairs:
            return {}

        llm = GenerationManager()
        prompt = f"""
        You are a food domain expert.

        Below is a list of ingredient pairs: the user's detected ingredient and 
        the closest match found in the database. 
        For each pair, determine whether both refer to the *same food item or type* 
        (e.g., "tofu" and "bean curd" → true; "perilla leaf" and "tea leaf" → false).

        Return ONLY a JSON array in this format:
        [
        {{"ingredient": "original_name", "matched": "db_name", "same_type": true/false}},
        ...
        ]

        Pairs to check:
        {json.dumps(pairs, ensure_ascii=False, indent=2)}
        """

        try:
            response = llm.generate(prompt)
            text = response.get("text", "")
            json_start = text.find("[")
            json_end = text.rfind("]")
            if json_start == -1 or json_end == -1:
                print("[WARN] GPT guardrail: No valid JSON returned.")
                return {}

            parsed = json.loads(text[json_start:json_end + 1])
            return {
                item["ingredient"]: bool(item.get("same_type", False))
                for item in parsed if "ingredient" in item
            }
        except Exception as e:
            print(f"[ERROR] GPT batch guardrail failed: {e}")
            return {}


class RAGGuardrailService:
    def __init__(self):
        self.llm = GenerationManager()
        self.prompts = PromptManager()
        print("RAGGuardrailService initialized.")

    def route_intent(self, query: str) -> Tuple[str, Dict[str, Any]]:
        try:
            router_prompt_str = self.prompts.load("router_prompt", query=query)
            router_response = self.llm.generate(router_prompt_str)
            intent = router_response.get("text").strip().upper()
            
            router_tokens = {
                "prompt_tokens": router_response.get("prompt_tokens", 0),
                "completion_tokens": router_response.get("completion_tokens", 0),
                "total_tokens": router_response.get("total_tokens", 0)
            }
            
            if "GREETING" in intent:
                return "GREETING", router_tokens
            if "META_QUERY" in intent:
                return "META_QUERY", router_tokens
            if "OUT_OF_DOMAIN" in intent:
                print(f"Guardrail triggered: Out-of-domain query detected. Query: '{query}'")
                return "OUT_OF_DOMAIN", router_tokens
            
            return "RAG_QUERY", router_tokens
            
        except Exception as e:
            print(f"Error in intent routing: {e}. Defaulting to RAG_QUERY.")
            return "RAG_QUERY", {}

    def check_retrieval(self, context_chunks: List[str]) -> Tuple[bool, str]:
        if not context_chunks:
            answer = "I couldn't find this information in the documents. Could you please clarify your question?"
            return False, answer
            
        return True, ""