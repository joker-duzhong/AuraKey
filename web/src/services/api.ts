// API 配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  token?: string;
  user?: any;
  userId?: number;
  error?: any;
}

// 获取 token
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// API 请求基础方法
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 如果存在 token，添加到请求头
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 如果响应不成功，抛出错误
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// GET 请求
export const apiGet = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'GET' });
};

// POST 请求
export const apiPost = async <T = any>(
  endpoint: string,
  body: any
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

// PUT 请求
export const apiPut = async <T = any>(
  endpoint: string,
  body: any
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

// DELETE 请求
export const apiDelete = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};
