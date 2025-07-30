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
    const { data } = await apiClient.get<User[]>("/users");
    return data;
  },

  updateUserRole: async (userId: number, role: UserRole): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${userId}/role`, {
      role,
    });
    return data;
  },

  getUserById: async (userId: number): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${userId}`);
    return data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },
};
