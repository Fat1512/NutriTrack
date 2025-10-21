import { API, AUTH_REQUEST } from "../utils/axiosConfig";

export async function getIngredient() {
  try {
    const res = await AUTH_REQUEST.get("/ingredients", {});
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Unknown error"
    );
  }
}
