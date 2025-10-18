import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../service/authService";
import type { User } from "../service/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    confirmedPassword: string
  ) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await authService.login({ username, password });
      queryClient.setQueryData(["currentUser"], response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    username: string,
    password: string,
    confirmedPassword: string
  ): Promise<void> => {
    try {
      await authService.register({ username, password, confirmedPassword });
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    window.localStorage.clear();
  };

  const value: AuthContextType = {
    user: currentUser || null,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
