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
