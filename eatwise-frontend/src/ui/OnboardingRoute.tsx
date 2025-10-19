import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "./LoadingPage";
import type { ReactNode } from "react";

interface OnboardingRouteProps {
  children: ReactNode;
}

const OnboardingRoute = ({ children }: OnboardingRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.isOnboarded) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default OnboardingRoute;
