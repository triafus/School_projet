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
        if (!localStorage.getItem("token")) return null;
        return await AuthService.getProfile();
      } catch {
        return null;
      }
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      AuthService.login(credentials.email, credentials.password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      queryClient.setQueryData(["auth", "user"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => AuthService.register(userData),
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      queryClient.setQueryData(["auth", "user"], data.user);
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
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
  };
};
