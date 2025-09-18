import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword, loading, error } = useAuth();
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(''); // Önceki mesajý temizle
        try {
            await forgotPassword(email);
            // Baþarýlý olduðunda, useAuth içindeki alert mesajý gösterilecek
            // ve kullanýcý login sayfasýna yönlendirilecek.
            // Buraya ek bir baþarý mesajý da koyabiliriz.
            setMessage('Password reset link has been sent if the email exists.');
        } catch (err) {
            // Hata zaten useAuth hook'u tarafýndan yönetiliyor ve 'error' state'ine yazýlýyor.
            console.error("Forgot password attempt failed:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    Forgot Your Password?
                </h2>
                <p className="text-center text-sm text-gray-600">
                    Enter your email address and we will send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button
                            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>
                {/* Hem baþarý hem hata mesajlarý için alan */}
                {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
                {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
                <p className="mt-4 text-sm text-center text-gray-600">
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        &larr; Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;