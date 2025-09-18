import { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const { resetPassword, loading, error } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const tokenFromQuery = query.get('token');
        const emailFromQuery = query.get('email');

        if (tokenFromQuery && emailFromQuery) {
            setToken(tokenFromQuery);
            setEmail(emailFromQuery);
        } else {

            alert("Invalid password reset link.");
            navigate('/login');
        }
    }, [query, navigate]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await resetPassword({
                email,
                token,
                newPassword: password,
                confirmPassword: confirmPassword,
            });
        } catch (err) {
            console.error("Reset password attempt failed:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    Set a New Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            New Password
                        </label>
                        <input
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            className="w-full px-3 py-2 mt-1 border rounded-md"
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button
                            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;