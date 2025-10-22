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
import time
import json
from components.manager import PromptManager
from components.manager import GenerationManager
from .nutrition_service import NutritionService
import re

class FoodPipeline:
    def __init__(self):
        start = time.time()
        print("Initializing FoodPipeline...")
        
        self.llm = GenerationManager()
        self.prompts = PromptManager()
        self.nutrition = NutritionService()
        
        print(f"FoodPipeline initialized successfully ({time.time() - start:.2f}s)")

    def analyze_image(self, image_paths):
        print(f"Starting analysis for image(s): {image_paths}")
        start = time.time()

        detect_prompt = self.prompts.load("detect_ingredients")
        print("Sending detection prompt to LLM...")
        
        llm_response = self.llm.generate(detect_prompt, images=image_paths)
        detected_text = llm_response.get("text", "")
        token_usage = {
            "prompt_tokens": llm_response.get("prompt_tokens", 0),
            "completion_tokens": llm_response.get("completion_tokens", 0),
            "total_tokens": llm_response.get("total_tokens", 0)
        }
        print(detected_text)

        try:
            json_str_match = re.search(r'\{.*\}', detected_text, re.DOTALL)
            if not json_str_match:
                raise Exception("No JSON object found in LLM output")
            
            detected_data_full = json.loads(json_str_match.group(0))
            
            if not detected_data_full.get("is_food"):
                print("Analysis stopped: Image was determined not to be food.")
                return {
                    "dish_name": "Không phải đồ ăn",
                    "detected_ingredients": [],
                    "nutrition_per_ingredient": {},
                    "total_nutrition": {},
                    "token_usage": token_usage
                }

            dish_name = detected_data_full.get("dish_name", "Món ăn không rõ tên")
            detected_ingredients_array = detected_data_full.get("ingredients", [])
            
            if not detected_ingredients_array:
                print("Warning: Image is food, but no ingredients were detected.")
                return {
                    "dish_name": dish_name,
                    "detected_ingredients": [],
                    "nutrition_per_ingredient": {},
                    "total_nutrition": {},
                    "token_usage": token_usage
                }
                
        except Exception as e:
            print(f"Error parsing LLM JSON output: {e}")
            print(f"Raw output was: {detected_text}")
            return {"error": "Failed to parse LLM output", "raw": detected_text, "token_usage": token_usage}

        ingredients_list = [item['ingredient'] for item in detected_ingredients_array]
        weight_estimates = {item['ingredient'].lower(): item['weight_g'] for item in detected_ingredients_array}
        
        print(f"Parsed dish name: {dish_name}")
        print(f"Parsed ingredients: {ingredients_list}")

        print("Matching ingredients with nutrition database...")
        match_results = self.nutrition.find_for_list(ingredients_list)
        
        base_nutrition_data = {}
        for ingr, matches in match_results.items():
            if matches:
                base_nutrition_data[ingr] = matches[0]  
            else:
                base_nutrition_data[ingr] = None
       
        print(f"Found {len(base_nutrition_data)} base nutrition records.")

        final_calculated_nutrition = {}
        total_nutrition = {
            'total_calories': 0,
            'total_fat_g': 0,
            'total_carb_g': 0,
            'total_protein_g': 0,
            'total_fiber_g': 0
        }
       
        for ingr, db_data in base_nutrition_data.items():
            if db_data:
                estimated_weight = weight_estimates.get(ingr.lower(), 0)
                
                calculated_data = db_data.copy()
                calculated_data['estimated_weight_g'] = estimated_weight
                
                cal = db_data['cal/g'] * estimated_weight
                fat = db_data['fat(g)'] * estimated_weight
                carb = db_data['carb(g)'] * estimated_weight
                prot = db_data['protein(g)'] * estimated_weight
                
                calculated_data['total_calories'] = cal
                calculated_data['total_fat_g'] = fat
                calculated_data['total_carb_g'] = carb
                calculated_data['total_protein_g'] = prot
                
                total_nutrition['total_calories'] += cal
                total_nutrition['total_fat_g'] += fat
                total_nutrition['total_carb_g'] += carb
                total_nutrition['total_protein_g'] += prot

                if 'fiber(g)' in db_data: 
                    fiber = db_data['fiber(g)'] * estimated_weight
                    calculated_data['total_fiber_g'] = fiber
                    total_nutrition['total_fiber_g'] += fiber
                
                final_calculated_nutrition[ingr] = calculated_data

        print(f"Analysis completed in {time.time() - start:.2f}s")
        
        return {
            "dish_name": dish_name,
            "detected_ingredients": detected_ingredients_array,
            "nutrition_per_ingredient": final_calculated_nutrition,
            "total_nutrition": total_nutrition,
            "token_usage": token_usage
        }

    def analyze_routine(self, routine_data, user_status):
        print("Starting routine analysis...")
        start = time.time()
        
        total_token_usage = {
            "prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0
        }

        total_nutrition = {
            'totalCal': 0, 'totalProtein': 0, 'totalFat': 0, 'totalCarb': 0
        }
        
        if 'foods' not in routine_data or not isinstance(routine_data['foods'], dict):
            return {"error": "Invalid routine format: 'foods' key is missing.", "token_usage": total_token_usage}

        for meal_type, meal_list in routine_data['foods'].items():
            if isinstance(meal_list, list):
                for meal in meal_list:
                    total_nutrition['totalCal'] += meal.get('totalCal', 0)
                    total_nutrition['totalProtein'] += meal.get('totalProtein', 0)
                    total_nutrition['totalFat'] += meal.get('totalFat', 0)
                    total_nutrition['totalCarb'] += meal.get('totalCarb', 0)
        
        print(f"Calculated totals: {total_nutrition}")

        try:
            user_profile_str = json.dumps(user_status, indent=2, ensure_ascii=False)
            daily_summary_str = json.dumps(total_nutrition, indent=2, ensure_ascii=False)

            analysis_prompt = self.prompts.load(
                "analyze_routine",
                user_profile=user_profile_str,
                daily_summary=daily_summary_str
            )
        except FileNotFoundError:
            print("Error: analyze_routine.txt prompt file not found.")
            return {"error": "Prompt file 'analyze_routine.txt' is missing.", "token_usage": total_token_usage}
        except Exception as e:
            print(f"Error loading prompt: {e}")
            return {"error": "Failed to load analysis prompt.", "token_usage": total_token_usage}

        print("Sending routine analysis prompt to LLM...")
        
        llm_response = self.llm.generate(analysis_prompt)
        remark_text = llm_response.get("text", "")
        total_token_usage = {
            "prompt_tokens": llm_response.get("prompt_tokens", 0),
            "completion_tokens": llm_response.get("completion_tokens", 0),
            "total_tokens": llm_response.get("total_tokens", 0)
        }
        
        print(f"Routine analysis completed in {time.time() - start:.2f}s")

        return {
            "daily_total": total_nutrition,
            "analysis_remark": remark_text,
            "token_usage": total_token_usage
        }