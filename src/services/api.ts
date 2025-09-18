import axios from 'axios';
import type { AuthResponse, Invoice, LoginData, RegisterData, ApiResponse, User, ForgotPasswordData, ResetPasswordData } from '../types';

const API_URL = 'https://localhost:7052/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getInvoices = async (): Promise<Invoice[]> => {
    const response = await apiClient.get<ApiResponse<Invoice[]>>('/invoices');
    return response.data.data;
};


export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/Auth/login', loginData);
    return response.data.data;
};

export const registerUser = async (registerData: RegisterData): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/Auth/register', registerData);
    return response.data;
};

export const forgotPassword = async (forgotPasswordData: ForgotPasswordData): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/Auth/forgot-password', forgotPasswordData);
    return response.data;
};

export const resetPassword = async (resetPasswordData: ResetPasswordData): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/Auth/reset-password', resetPasswordData);
    return response.data;
};