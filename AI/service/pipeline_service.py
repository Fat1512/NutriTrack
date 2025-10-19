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
        ingredients = re.findall(r"[A-Za-z]+(?:\s+[A-Za-z]+)*", detected_text)
        ingredients = [i.strip().lower() for i in ingredients if len(i.strip()) > 1]
        
        print(f"Parsed ingredients: {ingredients}")

        print("Matching ingredients with nutrition database...")
        match_results = self.nutrition.find_for_list(ingredients)
        filtered_results = {}
        for ingr, matches in match_results.items():
            if matches:
                filtered_results[ingr] = matches[0]  
            else:
                filtered_results[ingr] = None

        match_results = filtered_results
        print(f"Found {len(match_results)} nutrition records.")

        print("Sending verification prompt to LLM...")
        verify_prompt = self.prompts.load(
            "verify_result",
            ingredients=json.dumps(ingredients),
            final_ingredients=json.dumps(match_results)
        )
        verify_text = self.llm.generate(verify_prompt)
        
        print(f"Verification result: {verify_text[:300].replace('\n', ' ')}")

        print(f"Analysis completed in {time.time() - start:.2f}s")
        
        return {
            "detected": ingredients,
            "verified": verify_text,
            "nutrition": match_results
        }