// Konum: src/components/Dashboard.tsx

import { FaFileInvoiceDollar, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useInvoices } from '../hooks/useInvoices';
import type { Invoice } from '../types'; // Invoice tipini import ediyoruz

const Dashboard = () => {
    const { user } = useAuth();
    const { invoices, loading: invoicesLoading, error: invoicesError } = useInvoices();

    // --- ÝSTATÝSTÝKLERÝ GERÇEK VERÝLERE GÖRE HESAPLA (TÝPLER EKLENDÝ) ---

    const totalInvoices = invoices.length;

    const overdueInvoices = invoices.filter(
        // 'inv' parametresinin tipini açýkça belirtiyoruz.
        (inv: Invoice) => new Date(inv.dueDate) < new Date() && inv.status === 'Pending'
    ).length;

    const monthlyRevenue = invoices
        .filter((inv: Invoice) =>
            inv.status === 'Paid' &&
            new Date(inv.createdAt).getMonth() === new Date().getMonth() &&
            new Date(inv.createdAt).getFullYear() === new Date().getFullYear()
        )
        // 'sum' ve 'inv' parametrelerinin tiplerini açýkça belirtiyoruz.
        .reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);

    const stats = [
        {
            title: "Total Invoices",
            value: totalInvoices.toString(),
            icon: <FaFileInvoiceDollar className="h-8 w-8 text-blue-500" />,
        },
        {
            title: "Overdue",
            value: overdueInvoices.toString(),
            icon: <FaExclamationTriangle className="h-8 w-8 text-red-500" />,
        },
        {
            title: "Revenue (This Month)",
            value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlyRevenue),
            icon: <FaChartLine className="h-8 w-8 text-green-500" />,
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back, {user?.firstName || 'User'}!
                </h1>
                <p className="text-gray-500 mt-1">Here's a summary of your account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invoicesLoading ? <p>Loading stats...</p> :
                    invoicesError ? <p className="text-red-500">Could not load stats.</p> :
                        stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
            </div>

            <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Recent Activity
                </h2>
                <p className="text-gray-600">
                    Your recent invoices and payments will appear here.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;