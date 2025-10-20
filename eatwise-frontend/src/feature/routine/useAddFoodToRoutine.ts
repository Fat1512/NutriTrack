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
