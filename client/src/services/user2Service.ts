import axios from "axios";

const API_URL = "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userService = {
  getAllUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  updateUserRole: async (userId: number, role: "user" | "admin") => {
    const response = await apiClient.patch(`/users/${userId}/role`, { role });
    return response.data;
  },

  getUserById: async (userId: number) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },
};
