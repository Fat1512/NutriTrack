import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFoodToRoutine as addFoodToRoutineAPI } from "../../service/routineSerivce";
import { useSearchParams } from "react-router-dom";
export type MealKey = "BREAKFAST" | "LUNCH" | "DINNER";
interface resposne {
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
  const { isPending, mutate: addFoodToRoutine } = useMutation<
    resposne,
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
        queryKey: ["pickedDate", searchParams.get("pickedDate")],
      });
    },
  });
  return { isPending, addFoodToRoutine };
}
