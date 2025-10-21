import { AI_REQUEST } from "../utils/axiosConfig";

class DetectService {
  async detectNutrition(data: FormData): Promise<any> {
    try {
      const response = await AI_REQUEST.post<any>(`/api/analyze`, data);
      console.log(response);
      return null;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
  }
}

export default new DetectService();
