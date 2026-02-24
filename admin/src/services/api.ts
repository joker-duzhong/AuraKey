export const API_BASE_URL = "https://zaiwen.lxyy.fun/api";

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  token?: string;
  user?: any;
  userId?: number;
  error?: any;
}

const getToken = (): string | null => {
  return localStorage.getItem("admin_token");
};

export const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = endpoint?.includes("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};
