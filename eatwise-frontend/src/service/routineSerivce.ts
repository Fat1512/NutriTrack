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
export async function updateWaterConsume({
  routineId,
  waterConsume,
}: {
  routineId: string;
  waterConsume: number;
}) {
  try {
    const res = await AUTH_REQUEST.put(`/routine/${routineId}/water-consume`, {
      waterConsume,
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
export async function getMarkedDay(month: number, year: number) {
  try {
    const res = await AUTH_REQUEST.get("/routine/marked", {
      params: { month, year },
    });
    return res.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || error.message || "Unknown error"
    );
  }
}
export async function analyzeRoutine(pickedDate: string) {
  try {
    const res = await AUTH_REQUEST.get("/routine/analyze-routine", {
      params: { pickedDate },
    });
    return res.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || error.message || "Unknown error"
    );
  }
}
export async function getStaticNutrient(month: number, year: number) {
  try {
    const res = await AUTH_REQUEST.get("/routine/statics", {
      params: { month, year },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || error.message || "Unknown error"
    );
  }
}
export async function getCalConsumePickedDate(pickedDate: string) {
  try {
    const res = await AUTH_REQUEST.get("/routine/cal", {
      params: { pickedDate },
    });

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || error.message || "Unknown error"
    );
  }
}
export async function getAggretionConsumeNutrient() {
  try {
    const res = await AUTH_REQUEST.get("/routine/consume-nutrient", {});
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || error.message || "Unknown error"
    );
  }
}
