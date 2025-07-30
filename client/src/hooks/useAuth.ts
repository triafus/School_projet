import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/authServices";
import { RegisterData } from "../types/auth";
import { User } from "../types/user";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const userQuery = useQuery<User | null>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return await AuthService.getProfile();
      } catch {
        localStorage.removeItem("token");
        return null;
      }
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      AuthService.login(credentials.email, credentials.password),
    onMutate: () => {
      queryClient.setQueryData(["auth", "error"], null);
    },
    onSuccess: async (data) => {
      localStorage.setItem("token", data.access_token);
      await queryClient.refetchQueries({
        queryKey: ["auth", "user"],
        exact: true,
      });
    },
    onError: (error) => {
      queryClient.setQueryData(["auth", "error"], error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => AuthService.register(userData),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.access_token);
      await queryClient.refetchQueries({
        queryKey: ["auth", "user"],
        exact: true,
      });
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.setQueryData(["auth", "user"], null);
    queryClient.removeQueries();
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    login: loginMutation.mutate,
    isLoggingIn:
      loginMutation.isPending ||
      (loginMutation.isSuccess && userQuery.isFetching),
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
    error: queryClient.getQueryData(["auth", "error"]),
  };
};
