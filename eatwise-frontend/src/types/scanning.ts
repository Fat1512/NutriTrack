/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface NutritionInfo {
  "cal/g": number;
  "carb(g)": number;
  "fat(g)": number;
  id: number;
  ingr: string;
  "protein(g)": number;
  estimated_weight_g: number;
  total_calories: number;
  total_carb_g: number;
  total_fat_g: number;
  total_protein_g: number;
}

export interface DetectedIngredient {
  ingredient: string;
  weight_g: number;
}

export interface TotalNutritionSummary {
  total_calories: number;
  total_carb_g: number;
  total_fat_g: number;
  total_protein_g: number;
}

export interface ScanResult {
  detected_ingredients: DetectedIngredient[];
  dish_name: string;
  nutrition_per_ingredient: Record<string, NutritionInfo>;
  total_nutrition: TotalNutritionSummary;
  verified: string;
}

export interface TotalNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
