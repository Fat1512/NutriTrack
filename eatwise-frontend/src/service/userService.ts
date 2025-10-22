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
