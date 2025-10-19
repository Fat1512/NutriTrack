import { API } from "../utils/axiosConfig";

export async function getIngredient() {
  try {
    const res = await API.get("/ingredients", {});
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Unknown error"
    );
  }
}
