import { create } from "zustand";
import type { User } from "../types";
import { getUser, getToken, setUser, setToken, removeUser, removeToken } from "../utils/auth";
import { authService } from "../services/auth";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: getUser(),
  token: getToken(),
  isLoading: false,
  isAuthenticated: !!getToken(),

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(email, password);
      setToken(response.token);
      setUser(response.user);
      set({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeToken();
      removeUser();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  setUser: (user: User) => {
    setUser(user);
    set({ user });
  },

  initAuth: async () => {
    const token = getToken();
    if (token) {
      try {
        set({ isLoading: true });
        const user = await authService.getCurrentUser();
        setUser(user);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Failed to get user:", error);
        removeToken();
        removeUser();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      } finally {
        set({ isLoading: false });
      }
    }
  },
}));
