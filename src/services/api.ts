import axios from 'axios';
import type { AuthResponse, Invoice, UpdateInvoiceData, LoginData, RegisterData, ApiResponse, User, ForgotPasswordData, ResetPasswordData, CreateInvoiceData } from '../types';

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

export const createInvoice = async (invoiceData: CreateInvoiceData): Promise<ApiResponse<Invoice>> => {
    const response = await apiClient.post<ApiResponse<Invoice>>('/invoices', invoiceData);
    return response.data;
};

export const deleteInvoice = async (invoiceNumber: string): Promise<ApiResponse<boolean>> => {
    // Backend'deki DeleteInvoice endpoint'i /invoices/{invoiceNumber} rotasýný kullanýyor.
    const response = await apiClient.delete<ApiResponse<boolean>>(`/invoices/${invoiceNumber}`);
    return response.data;
};

export const getInvoiceByNumber = async (invoiceNumber: string): Promise<Invoice> => {
    const response = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${invoiceNumber}`);
    return response.data.data;
};

export const updateInvoice = async (invoiceNumber: string, invoiceData: UpdateInvoiceData): Promise<ApiResponse<Invoice>> => {
    const response = await apiClient.put<ApiResponse<Invoice>>(`/invoices/${invoiceNumber}`, invoiceData);
    return response.data;
};