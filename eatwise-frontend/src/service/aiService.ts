import { AI_REQUEST } from "../utils/axiosConfig";

export async function getChatAI(query: string): Promise<any> {
  try {
    const response = await AI_REQUEST.post<any>(`/api/rag/chat`, { query });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Update failed");
  }
}
