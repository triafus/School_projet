import { useProtectedRoute } from "../hooks/useProtectedRoutes";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useProtectedRoute("admin");

  if (isLoading) return <div>Chargement...</div>;

  return user?.role === "admin" ? children : null;
};
