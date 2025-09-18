import { useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginData, RegisterData, User, ResetPasswordData } from '../types';
import axios from 'axios';
import { AuthContext } from './AuthContext'; 
import {
    forgotPassword as apiForgotPassword,
    resetPassword as apiResetPassword
} from '../services/api';

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await axios.get('https://localhost:7052/api/Auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const { userId, firstName, lastName, email, talentId, talentName } = response.data;
                    setUser({ id: userId, firstName, lastName, email, talentId, talentName } as User);
                } catch (err) {

                    console.error("Failed to fetch user with token, logging out.",err);
                    logout();
                }
            }
        };
        fetchUser();
    }, [token]);  

    const login = async (loginData: LoginData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('https://localhost:7052/api/Auth/login', loginData);
            const newToken = response.data.data.token;
            const userData = response.data.data.user;
            localStorage.setItem('token', newToken);
            setUser(userData); 
            setToken(newToken);
            navigate('/dashboard');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'Login failed.');
            } else {
                setError('An unexpected error occurred.');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            await apiForgotPassword({ email });
            alert('If an account with that email exists, a password reset link has been sent.');
            navigate('/login');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'Request failed.');
            } else {
                setError('An unexpected error occurred.');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (resetData: ResetPasswordData) => {
        setLoading(true);
        setError(null);
        try {
            await apiResetPassword(resetData);
            alert('Your password has been reset successfully! Please log in.');
            navigate('/login');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.log("BACKEND ERROR RESPONSE:", err.response.data);
                const apiErrors = err.response.data.errors;
                if (apiErrors && Array.isArray(apiErrors)) {
                    setError(apiErrors.join(' '));
                } else {
                    setError(err.response.data.message || 'Password reset failed.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (registerData: RegisterData) => {
        setLoading(true);
        setError(null);
        try {
            await axios.post('https://localhost:7052/api/Auth/register', registerData);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const apiErrors = err.response.data.errors;
                if (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) {
                    setError(apiErrors.join(' '));
                } else {
                    setError(err.response.data.message || 'Registration failed.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null); 
        navigate('/login');
    };

    const value = {
        token,
        user,
        login,
        logout,
        register,
        loading,
        error,
        forgotPassword, 
        resetPassword   
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;