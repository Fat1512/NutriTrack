import React from "react";
import { Box, Card, CardContent } from "@mui/material";
import type { ScanResult } from "../../types/scanning";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useAuth } from "../../context/AuthContext";

interface NutritionResultsProps {
  data: ScanResult;
  imageUrl?: string | null;
}

const NutritionResults: React.FC<NutritionResultsProps> = ({
  data,
  imageUrl,
}) => {
  const totalCategories = Math.round(data.total_nutrition.total_calories);
  const { user } = useAuth();
  const nutritions = () => {
    return [
      {
        title: "Protein",
        total: Math.round(data.total_nutrition.total_protein_g),
        target: user?.goal_protein || 0,
        color: "#F87171",
      },
      {
        title: "Carb",
        total: Math.round(data.total_nutrition.total_carb_g),
        target: user?.goal_carb || 0,
        color: "#FBBF24",
      },
      {
        title: "Fat",
        total: Math.round(data.total_nutrition.total_fat_g),
        target: user?.goal_fat || 0,
        color: "#60A5FA",
      },
    ];
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className=" mx-auto max-w-8xl px-6 py-8">
        <div className="grid lg:grid-cols-8 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden shadow-2xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm transform  transition-all duration-500">
              <div className="h-56 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={data.dish_name}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                ) : (
                  <h2 className="text-white/80 animate-pulse">🍜</h2>
                )}
                <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 hover:bg-black/5"></div>
              </div>
              <CardContent className="p-6 border-t-2 border-gray-100">
                <div className="flex items-center justify-center mb-4">
                  <div className="font-bold text-2xl text-gray-800 mb-1 text-center animate-fade-in-up">
                    {data.dish_name}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-2xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm transform transition-all duration-500 hover:shadow-3xl">
              <CardContent className="p-8 border-b-2 border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="animate-slide-in-left">
                    <h2 className="font-bold text-gray-800 mb-1">
                      Nutrition Overview
                    </h2>
                    <h2 className="text-gray-600">
                      Calories and macronutrients breakdown
                    </h2>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-400 cursor-pointer via-orange-500 to-amber-500 rounded-2xl p-6 mb-8 text-center text-white shadow-2xl border-2 border-orange-300 transform transition-all duration-300 animate-bounce-subtle">
                  <h2 className="opacity-90 mb-2">Total Calories</h2>
                  <h2 className="text-3xl font-bold mb-1 animate-pulse">
                    {totalCategories}
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {nutritions().map((nutrition, index): any => {
                    return (
                      <>
                        <div
                          key={nutrition.title}
                          className="flex flex-col items-center transform transition-all duration-300 animate-fade-in-up p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:shadow-lg"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="w-25 h-25 hover:rotate-12 transition-transform duration-500">
                            <CircularProgressbar
                              value={nutrition.total}
                              maxValue={nutrition.target}
                              text={`${nutrition.total}`}
                              styles={buildStyles({
                                pathColor: nutrition.color,
                                textColor: "#111827",
                                trailColor: "#E5E7EB",
                                textSize: "24px",
                              })}
                            />
                          </div>
                          <div className="mt-2 text-center">
                            <div className="font-semibold">
                              {nutrition.title}
                            </div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-2xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm transform transition-all duration-500 hover:shadow-3xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="animate-slide-in-left">
                    <h2 className="font-bold text-gray-800 mb-1">
                      Ingredients Breakdown
                    </h2>
                    <h2 className="text-gray-600">
                      Detected ingredients with nutritional values
                    </h2>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(data.nutrition_per_ingredient).map(
                    ([key, item], index) => {
                      const totalGrams = item.estimated_weight_g;
                      const totalCalories = Math.round(item.total_calories);
                      return (
                        <div
                          key={key}
                          className="bg-gradient-to-br cursor-pointer from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-green-300 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-gray-800 capitalize hover:text-green-600 transition-colors duration-300">
                              {key}
                            </h2>
                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 hover:bg-green-200 transition-all duration-300 hover:scale-110">
                              <h2 className="font-medium">
                                {totalCalories} cal
                              </h2>
                            </div>
                          </div>
                          <h2 className="text-green-600 font-bold mb-1 hover:text-green-700 transition-colors duration-300">
                            {totalGrams}g
                          </h2>
                          <div className="text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-2 mt-2">
                            <div className="hover:text-gray-700 transition-colors duration-200">
                              Protein: {Math.round(item.total_protein_g)}g
                            </div>
                            <div className="hover:text-gray-700 transition-colors duration-200">
                              Carbs: {Math.round(item.total_carb_g)}g
                            </div>
                            <div className="hover:text-gray-700 transition-colors duration-200">
                              Fat: {Math.round(item.total_fat_g)}g
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default NutritionResults;
