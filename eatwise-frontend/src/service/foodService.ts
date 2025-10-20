import { AI_REQUEST, API, AUTH_REQUEST } from "../utils/axiosConfig";

interface FoodsParams {
  page: number;
  size: number;
}

export async function getFoods({ page, size }: FoodsParams) {
  try {
    const params: Record<string, string | number> = { page, size };

    const res = await AUTH_REQUEST.get("/foods", {
      params,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Unknown error"
    );
  }
}

export async function getFood(id: string) {
  try {
    const res = await AUTH_REQUEST.get(`/food/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Unknown error"
    );
  }
}

export async function detectNutrition(data: FormData) {
  try {
    const res = await AI_REQUEST.post("/llm/analyze", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Unknown error"
    );
  }
}
