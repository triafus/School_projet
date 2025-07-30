import { apiClient } from "../apiClient";
import { User, UserRole } from "../types/user";

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
