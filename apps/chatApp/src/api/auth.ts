import { MMKV } from 'react-native-mmkv';
import apiClient from './client';

const storage = new MMKV();

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/login', data);
    console.log({ response });
    return response.data;
  },

  logout: () => {
    // Clear token from storage
    storage.delete('token');
  },
};
