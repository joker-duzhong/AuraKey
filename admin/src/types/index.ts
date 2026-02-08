// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 登录响应
export interface LoginResponse {
  token?: string;
  user?: User;
}

// API 响应包装
export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

// 列表响应
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}
