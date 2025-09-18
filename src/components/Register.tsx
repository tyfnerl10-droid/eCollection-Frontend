import { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        phoneNumber: '',
    });

    const { register, loading, error } = useAuth();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await register(formData);
        } catch (err) {
            // Hata zaten useAuth hook'u tarafından yönetiliyor ve 'error' state'ine yazılıyor.
            // Sadece konsola loglamak yeterli.
            console.error("Registration attempt failed:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Create an Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">First Name</label>
                            <input className="w-full px-3 py-2 mt-1 border rounded-md" name="firstName" type="text" placeholder="Tayfun" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">Last Name</label>
                            <input className="w-full px-3 py-2 mt-1 border rounded-md" name="lastName" type="text" placeholder="EROL" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <input className="w-full px-3 py-2 mt-1 border rounded-md" name="email" type="email" placeholder="eCollection@eCollection.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="companyName">Company Name</label>
                        <input className="w-full px-3 py-2 mt-1 border rounded-md" name="companyName" type="text" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="phoneNumber">Phone Number (Optional)</label>
                        <input className="w-full px-3 py-2 mt-1 border rounded-md" name="phoneNumber" type="tel" placeholder="+905070499253" value={formData.phoneNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                        <input className="w-full px-3 py-2 mt-1 border rounded-md" name="password" type="password" placeholder="8+ chars: 1 A-Z, 1 a-z, 1 0-9, 1 !@#$%" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                        <input className="w-full px-3 py-2 mt-1 border rounded-md" name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <div>
                        <button className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300" type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>

                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                    >
                        ← Back
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;