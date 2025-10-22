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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import OnboardingRoute from "./ui/OnboardingRoute";
import { SidebarProvider } from "./context/SidebarContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RoutinePage from "./page/RoutinePage";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import OnboardingPage from "./page/OnboardingPage";
import ScanningPage from "./page/ScanningPage";
import { GoalProvider } from "./context/GoalContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DailyProvider } from "./context/DailyContex";
import NutrientChart from "./feature/dashboard/NutrientChart";
import Chatbot from "./feature/chatbot/Chatbot";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools /> */}
      <AuthProvider>
        <SidebarProvider>
          <GoalProvider>
            <BrowserRouter>
              <DailyProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/onboarding"
                    element={
                      <OnboardingRoute>
                        <OnboardingPage />
                      </OnboardingRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/routine" replace />} />
                    <Route path="routine" element={<RoutinePage />} />
                    <Route path="scanning" element={<ScanningPage />} />
                    <Route path="/routine" element={<RoutinePage />} />
                    <Route path="/dashboard" element={<NutrientChart />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                  </Route>
                </Routes>
              </DailyProvider>
            </BrowserRouter>
          </GoalProvider>
        </SidebarProvider>
      </AuthProvider>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default App;
