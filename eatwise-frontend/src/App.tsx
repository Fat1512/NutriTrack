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
      <ReactQueryDevtools />
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
