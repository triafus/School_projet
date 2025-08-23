import { useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

type UserRole = "user" | "admin";

interface UseProtectedRouteOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  allowedRoles?: UserRole[];
  onUnauthorized?: () => void;
}

export const useProtectedRoute = (
  requiredRoleOrOptions?: UserRole | UseProtectedRouteOptions
) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Normalize options
  const options = useMemo(() => {
    if (typeof requiredRoleOrOptions === "string") {
      return { requiredRole: requiredRoleOrOptions };
    }
    return requiredRoleOrOptions || {};
  }, [requiredRoleOrOptions]);

  const {
    requiredRole,
    redirectTo = "/",
    allowedRoles,
    onUnauthorized,
  } = options;

  // Memoized authorization check
  const isAuthorized = useMemo(() => {
    if (!isAuthenticated || !user) return false;

    // Check specific required role
    if (requiredRole && user.role !== requiredRole) return false;

    // Check allowed roles list
    if (allowedRoles && !allowedRoles.includes(user.role as UserRole))
      return false;

    return true;
  }, [isAuthenticated, user, requiredRole, allowedRoles]);

  // Memoized redirect handler
  const handleRedirect = useCallback(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    if (!isAuthorized) {
      onUnauthorized?.();
      navigate(redirectTo, { replace: true });
    }
  }, [
    isLoading,
    isAuthenticated,
    isAuthorized,
    navigate,
    location.pathname,
    redirectTo,
    onUnauthorized,
  ]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized,
    hasRole: useCallback((role: UserRole) => user?.role === role, [user?.role]),
    hasAnyRole: useCallback(
      (roles: UserRole[]) =>
        user?.role && roles.includes(user.role as UserRole),
      [user?.role]
    ),
  };
};

// Hook for role-based rendering
export const useRoleAccess = () => {
  const { user } = useAuth();

  const hasRole = useCallback(
    (role: UserRole) => user?.role === role,
    [user?.role]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]) => user?.role && roles.includes(user.role as UserRole),
    [user?.role]
  );

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);
  const isUser = useMemo(() => user?.role === "user", [user?.role]);

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isUser,
    canAccess: useCallback(
      (requiredRole?: UserRole, allowedRoles?: UserRole[]) => {
        if (!user) return false;
        if (requiredRole && user.role !== requiredRole) return false;
        if (allowedRoles && !allowedRoles.includes(user.role as UserRole))
          return false;
        return true;
      },
      [user]
    ),
  };
};

// Hook for conditional navigation
export const useConditionalNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const navigateIf = useCallback(
    (
      condition: boolean | (() => boolean),
      path: string,
      options?: { replace?: boolean; state?: any }
    ) => {
      const shouldNavigate =
        typeof condition === "function" ? condition() : condition;
      if (shouldNavigate) {
        navigate(path, options);
      }
    },
    [navigate]
  );

  const navigateIfAuthenticated = useCallback(
    (path: string, options?: { replace?: boolean; state?: any }) => {
      navigateIf(isAuthenticated, path, options);
    },
    [navigateIf, isAuthenticated]
  );

  const navigateIfRole = useCallback(
    (
      role: UserRole,
      path: string,
      options?: { replace?: boolean; state?: any }
    ) => {
      navigateIf(user?.role === role, path, options);
    },
    [navigateIf, user?.role]
  );

  return {
    navigateIf,
    navigateIfAuthenticated,
    navigateIfRole,
  };
};
