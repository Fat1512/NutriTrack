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
