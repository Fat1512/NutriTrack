import { API, AUTH_REQUEST } from "../utils/axiosConfig";
import { setAccessToken, getAccessToken } from "../utils/helper";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmedPassword: string;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  isOnboarded: boolean;
  mainGoal: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  healthIssues: string[];
  specificDiet: string[];
  eatingHabits: string;
  goal_protein: number;
  goal_cal: number;
  goal_carb: number;
  goal_fat: number;
  daily_goal_cal: number;
}

export interface TokenDTO {
  accessToken: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    tokenDTO: TokenDTO;
  };
}

export interface RegisterResponse {
  status: string;
  message: string;
  data?: any;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await API.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      const { user, tokenDTO } = response.data.data;

      setAccessToken(tokenDTO.accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token: tokenDTO.accessToken };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async register(data: RegisterData): Promise<void> {
    try {
      await API.post<RegisterResponse>("/auth/register", data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await AUTH_REQUEST.get("/auth/profile");
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }

  logout(): void {
    window.location.reload();
  }

  getToken(): string | null {
    return getAccessToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
