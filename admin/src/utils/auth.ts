import Cookies from 'js-cookie';

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): any => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
