import type { FoodAddRoutine } from "../feature/routine/useAddFoodToRoutine";
import { AUTH_REQUEST } from "../utils/axiosConfig";

export async function addFoodToRoutine({
  foodId,
  pickedDate,
  meal,
  ingredientExtra,
}: FoodAddRoutine) {
  try {
    const res = await AUTH_REQUEST.post("/routine/food", {
      foodId,
      pickedDate,
      meal,
      ingredientExtra,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || error.message || "Unknown error"
    );
  }
}
export async function getRoutineByPickedDate(pickedDate: string) {
  try {
    const res = await AUTH_REQUEST.get("/routine/pickedDate", {
      params: { pickedDate },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || error.message || "Unknown error"
    );
  }
}
