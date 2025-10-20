import time
import json
from .prompt_manager import PromptManager
from model.factory import get_llm
from .nutrition_service import NutritionService
import re

class FoodPipeline:
    def __init__(self):
        start = time.time()
        print("Initializing FoodPipeline...")
        
        self.llm = get_llm()
        self.prompts = PromptManager()
        self.nutrition = NutritionService()
        
        print(f"FoodPipeline initialized successfully ({time.time() - start:.2f}s)")

    def analyze_image(self, image_paths):
        print(f"Starting analysis for image(s): {image_paths}")
        start = time.time()

        detect_prompt = self.prompts.load("detect_ingredients")
        print("Sending detection prompt to LLM...")
        
        detected_text = self.llm.generate(detect_prompt, images=image_paths)
        print(detected_text)

        try:
            json_str_match = re.search(r'\{.*\}', detected_text, re.DOTALL)
            if not json_str_match:
                raise Exception("No JSON object found in LLM output")
            
            detected_data_full = json.loads(json_str_match.group(0))
            
            dish_name = detected_data_full.get("dish_name", "Unknown Dish")
            detected_ingredients_array = detected_data_full.get("ingredients", [])
            
            if not detected_ingredients_array:
                raise Exception("No 'ingredients' array found in JSON")
                
        except Exception as e:
            print(f"Error parsing LLM JSON output: {e}")
            print(f"Raw output was: {detected_text}")
            return {"error": "Failed to parse LLM output", "raw": detected_text}

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
                
                final_calculated_nutrition[ingr] = calculated_data

        print(f"Analysis completed in {time.time() - start:.2f}s")
        
        return {
            "dish_name": dish_name,
            "detected_ingredients": detected_ingredients_array, 
            "nutrition_per_ingredient": final_calculated_nutrition, 
            "total_nutrition": total_nutrition, 
        }