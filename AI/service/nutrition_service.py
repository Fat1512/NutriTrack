import pandas as pd
from rapidfuzz import process, fuzz

class NutritionService:
    def __init__(self, csv_path="data/ingredients_metadata.csv"):
        self.df = pd.read_csv(csv_path)

    def find_similar(self, ingredient, limit=3):
        choices = self.df["ingr"].tolist()
        results = process.extract(ingredient, choices, scorer=fuzz.WRatio, limit=limit)
        return [self.df[self.df["ingr"] == r[0]].iloc[0].to_dict() for r in results if r[1] > 60]

    def find_for_list(self, ingredients):
        results = {}
        for ing in ingredients:
            matches = self.find_similar(ing)
            if matches:
                results[ing] = matches
        return results
