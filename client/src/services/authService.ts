import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    _id: string;
    email: string;
    name?: string;
    token: string;
  };
}

export const authService = {
  // Register a new user
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    const { token, ...user } = response.data.data;
    return { token, user };
  },

  // Login user
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    const { token, ...user } = response.data.data;
    return { token, user };
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Store auth data
  storeAuthData: (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get stored user
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;
