import type { Goal } from "../context/GoalContext";
import type { UserPreferences } from "../feature/onboarding/StepperComponentModern";
import { AUTH_REQUEST } from "../utils/axiosConfig";

export interface UserResponse {
  status: string;
  message: string;
  data: object;
}

class UserService {
  async updatePersonalization(
    data: UserPreferences,
    userId?: string
  ): Promise<any> {
    if (!userId) {
      throw new Error("User ID is required for personalization update");
    }

    try {
      const response = await AUTH_REQUEST.post<UserResponse>(
        `/users/${userId}/personalization`,
        data
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
  }
  async updateUserGoal(data: Goal): Promise<any> {
    try {
      const response = await AUTH_REQUEST.put(`/users/goal`, data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Update user goal failed"
      );
    }
  }

  async getGoalUser() {
    try {
      const response = await AUTH_REQUEST.get(`/users/goal`);

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to get user goal"
      );
    }
  }

  async markUserAsOnboarded(userId?: string) {
    if (!userId) {
      throw new Error("User ID is required to mark as onboarded");
    }

    try {
      await AUTH_REQUEST.patch<void>(`/users/${userId}/onboarding-complete`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update onboarding status"
      );
    }
  }
}

export default new UserService();
