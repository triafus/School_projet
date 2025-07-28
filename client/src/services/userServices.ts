import { apiClient } from "../apiClient";
import { ApiError } from "../types/api";
import { User, UserRole } from "../types/user";

const handleServiceError = (error: unknown) => {
  const err = error as ApiError;
  throw new Error(
    err.response?.data?.message || err.message || "An unexpected error occurred"
  );
};

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const { data } = await apiClient.get<User[]>("/users");
      return data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  updateUserRole: async (userId: number, role: UserRole): Promise<User> => {
    try {
      const { data } = await apiClient.patch<User>(`/users/${userId}/role`, {
        role,
      });
      return data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  getUserById: async (userId: number): Promise<User> => {
    try {
      const { data } = await apiClient.get<User>(`/users/${userId}`);
      return data;
    } catch (error) {
      return handleServiceError(error);
    }
  },

  deleteUser: async (userId: number): Promise<void> => {
    try {
      await apiClient.delete(`/users/${userId}`);
    } catch (error) {
      return handleServiceError(error);
    }
  },
};
