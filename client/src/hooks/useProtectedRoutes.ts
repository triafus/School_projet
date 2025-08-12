import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useProtectedRoute = (requiredRole?: "user" | "admin") => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, user, requiredRole, navigate, location]);

  return { user, isLoading };
};
