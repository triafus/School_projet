import { useProtectedRoute } from "../hooks/useProtectedRoutes";

export const AuthenticatedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoading } = useProtectedRoute();

  if (isLoading) return <div>Chargement...</div>;

  return user ? <>{children}</> : null;
};
