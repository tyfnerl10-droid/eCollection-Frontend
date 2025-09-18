import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Register from './components/Register';
import { useAuth } from './hooks/useAuth'; 
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';




function App() {

    const { token, logout } = useAuth();
   
    const PrivateRoutes = () => {
        return token ? <Outlet /> : <Navigate to="/login" />;
    };

    const PublicRoutes = () => {
        return !token ? <Outlet /> : <Navigate to="/dashboard" />;


    }


    return (
        <>
            {token && (
                <nav className="bg-gray-800 text-white p-4 shadow-md">
                    <ul className="container mx-auto flex items-center space-x-6">
                        <li><Link to="/dashboard" className="hover:text-indigo-400">Dashboard</Link></li>
                        <li><Link to="/invoices" className="hover:text-indigo-400">Invoices</Link></li>
                        <li className="ml-auto">
                            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium">
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            <main>
                <Routes>
                    {/* Giriþ yapmamýþ kullanýcýlar için rotalar */}
                    <Route element={<PublicRoutes />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Route>

                    {/* Giriþ yapmýþ kullanýcýlar için rotalar */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/invoices" element={<Invoices />} />
                    </Route>

                    {/* Baþlangýç rotasý: Herhangi bir eþleþmeyen URL, kullanýcýyý durumuna göre yönlendirir. */}
                    <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
                </Routes>
            </main>
        </>
    );
}

export default App;

