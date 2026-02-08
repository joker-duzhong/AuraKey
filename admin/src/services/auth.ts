import apiClient from "./api";
import type { LoginResponse, User } from "../types";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    // 响应拦截器已经返回了 response.data，所以直接返回即可
    return response as LoginResponse;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response as User;
  },

  refreshToken: async (): Promise<string> => {
    const response = await apiClient.post<{ token: string }>("/auth/refresh");
    return (response as { token: string }).token;
  },
};
