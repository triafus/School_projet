import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { AuthService } from "../services/authServices";
import { RegisterData } from "../types/auth";
import { User } from "../types/user";

// Query keys constants for better maintainability
const AUTH_QUERY_KEYS = {
  user: ["auth", "user"] as const,
  error: ["auth", "error"] as const,
} as const;

// Auth configuration
const AUTH_CONFIG = {
  staleTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: false,
  retry: 1,
} as const;

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Optimized user query with better error handling
  const userQuery = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return await AuthService.getProfile();
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem("token");
        // Clear user data from cache
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, null);
        return null;
      }
    },
    ...AUTH_CONFIG,
  });

  // Optimized login mutation with better error handling
  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      AuthService.login(credentials.email, credentials.password),
    onMutate: () => {
      // Clear previous errors
      queryClient.setQueryData(AUTH_QUERY_KEYS.error, null);
    },
    onSuccess: async (data) => {
      localStorage.setItem("token", data.access_token);
      // Optimistically update user data
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user || null);
      // Refetch to ensure data consistency
      await queryClient.refetchQueries({
        queryKey: AUTH_QUERY_KEYS.user,
        exact: true,
      });
    },
    onError: (error) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.error, error);
    },
  });

  // Optimized register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => AuthService.register(userData),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.access_token);
      // Optimistically update user data
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user || null);
      // Refetch to ensure data consistency
      await queryClient.refetchQueries({
        queryKey: AUTH_QUERY_KEYS.user,
        exact: true,
      });
    },
    onError: (error) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.error, error);
    },
  });

  // Memoized logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    queryClient.setQueryData(AUTH_QUERY_KEYS.user, null);
    queryClient.removeQueries();
  }, [queryClient]);

  // Memoized computed values
  const computedValues = useMemo(
    () => ({
      isAuthenticated: !!userQuery.data,
      isLoggingIn:
        loginMutation.isPending ||
        (loginMutation.isSuccess && userQuery.isFetching),
      isRegistering: registerMutation.isPending,
    }),
    [
      userQuery.data,
      loginMutation.isPending,
      loginMutation.isSuccess,
      userQuery.isFetching,
      registerMutation.isPending,
    ]
  );

  // Memoized login and register functions
  const login = useCallback(
    (credentials: { email: string; password: string }) => {
      loginMutation.mutate(credentials);
    },
    [loginMutation]
  );

  const register = useCallback(
    (userData: RegisterData) => {
      registerMutation.mutate(userData);
    },
    [registerMutation]
  );

  return {
    // User data
    user: userQuery.data,
    isLoading: userQuery.isLoading,

    // Computed states
    ...computedValues,

    // Actions
    login,
    register,
    logout,

    // Error state
    error: queryClient.getQueryData(AUTH_QUERY_KEYS.error),

    // Mutation states for granular control
    loginError: loginMutation.error,
    registerError: registerMutation.error,

    // Refetch function for manual refresh
    refetchUser: userQuery.refetch,
  };
};
