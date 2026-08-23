import { api } from './api.js';
import { User, ApiResponse } from '../types/index.js';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', { username, password });
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return api.post<ApiResponse<null>>('/auth/logout');
  },

  getCurrentUser: async (): Promise<{ success: boolean; user: User }> => {
    return api.get<{ success: boolean; user: User }>('/auth/me');
  },
};
