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

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import authService from "../service/authService";
import type { User } from "../service/authService";
import useUser from "./useUser";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
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

  const { currentUser, isLoading } = useUser();

  const login = async (username: string, password: string): Promise<User> => {
    try {
      const response = await authService.login({ username, password });
      queryClient.setQueryData(["currentUser"], response.user);
      return response.user;
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
