import { createContext } from 'react';
import type { LoginData, RegisterData, User, ResetPasswordData } from '../types';

export interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (loginData: LoginData) => Promise<void>;
    logout: () => void;
    register: (registerData: RegisterData) => Promise<void>;
    loading: boolean;
    error: string | null;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (resetData: ResetPasswordData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
