

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string; 
    roles: string[];
    talentId: string;
    talentName: string;
}

export interface AuthResponse {
    token: string;
    expires: string;
    user: User;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    description: string;
    amount: number;
    dueDate: string;
    status: string;
    createdAt: string;
    userId: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string; 
    confirmPassword?: string;
    companyName: string;
    phoneNumber?: string;
}

export interface LoginData {
    email: string;
    password?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: string[];
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}