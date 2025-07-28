import { apiClient } from "../apiClient";
import { LoginResponse, RegisterData } from "../types/auth";
import { ApiError } from "../types/api";
import { User } from "../types/user";

const handleServiceError = (error: unknown) => {
  const err = error as ApiError;
  throw new Error(
    err.response?.data?.message || err.message || "An unexpected error occurred"
  );
};

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const { data } = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      return data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  register: async (userData: RegisterData): Promise<LoginResponse> => {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        "/auth/register",
        userData
      );
      return data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const { data } = await apiClient.get<User>("/users/profile");
      return data;
    } catch (error) {
      return handleServiceError(error);
    }
  },
};
