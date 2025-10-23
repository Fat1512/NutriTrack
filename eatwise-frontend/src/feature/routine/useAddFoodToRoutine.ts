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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFoodToRoutine as addFoodToRoutineAPI } from "../../service/routineSerivce";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
export type MealKey = "BREAKFAST" | "LUNCH" | "DINNER";
export interface Resposne {
  status: string;
  data: object;
  message: string;
}
interface IngredientExtra {
  id: number;
  name: string;
  weight: number;
}

export interface FoodAddRoutine {
  foodId: string;
  meal: MealKey;
  pickedDate: string;
  ingredientExtra?: IngredientExtra[];
}

export default function useAddFoodToRoutine() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const pickedDate =
    searchParams.get("pickedDate") || dayjs().format("YYYY-MM-DD");
  console.log(pickedDate);
  const { isPending, mutate: addFoodToRoutine } = useMutation<
    Resposne,
    Error,
    FoodAddRoutine
  >({
    mutationFn: ({ foodId, pickedDate, meal, ingredientExtra }) =>
      addFoodToRoutineAPI({
        foodId,
        pickedDate,
        meal,
        ingredientExtra,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["pickedDate", pickedDate],
      });
      queryClient.invalidateQueries({
        queryKey: ["calDaily", pickedDate],
      });
      queryClient.invalidateQueries({
        queryKey: ["consumseNutrient", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["goal", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["marked"],
        exact: false,
      });
    },
  });
  return { isPending, addFoodToRoutine };
}
