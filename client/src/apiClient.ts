import axios, { InternalAxiosRequestConfig } from "axios";
import { ApiError } from "./types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: ApiError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Ne pas rediriger automatiquement - laisser les composants gérer la redirection
      // selon leur contexte (page publique vs protégée)
    }
    return Promise.reject(error);
  }
);
