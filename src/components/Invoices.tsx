import { useState } from 'react';
import { useInvoices } from '../hooks/useInvoices';
import { FaTrash, FaEdit, FaPlus, FaEye } from 'react-icons/fa';
import { Dialog } from '@headlessui/react'; 
import InvoiceForm from './InvoiceForm'; 
import type { CreateInvoiceData } from '../types';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Invoices = () => {
    const { invoices, loading, error, addInvoice, removeInvoice } = useInvoices();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const handleCreateInvoice = async (invoiceData: CreateInvoiceData) => {
        setFormLoading(true);
        try {
            await addInvoice(invoiceData);
            setIsModalOpen(false); 
        } catch (err) {
            let errorMessage = 'Failed to create the invoice. Please try again.';
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data.message || errorMessage;
            }
            alert(errorMessage);
            console.error("Create invoice failed:", err);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <p className="text-center mt-8">Loading invoices...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Invoices</h1>
                {invoices.length > 0 && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center shadow-sm">
                        <FaPlus className="mr-2" /> New Invoice
                    </button>
                )}
            </div>

            {invoices.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">No Invoices Found</h2>
                    <p className="text-gray-500 mt-2">Let's create your first invoice!</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold shadow-md">
                        Create Invoice
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice #</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                        <Link to={`/invoices/${invoice.invoiceNumber}`} className="text-indigo-600 hover:underline font-semibold">
                                            {invoice.invoiceNumber}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">{invoice.description}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right text-gray-900 font-medium">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)}
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-center">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${invoice.status === 'Paid' ? 'text-green-900' :
                                                invoice.status === 'Overdue' ? 'text-red-900' : 'text-yellow-900'
                                            }`}>
                                            <span aria-hidden className={`absolute inset-0 ${invoice.status === 'Paid' ? 'bg-green-200' :
                                                    invoice.status === 'Overdue' ? 'bg-red-200' : 'bg-yellow-200'
                                                } opacity-50 rounded-full`}></span>
                                            <span className="relative">{invoice.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-center">
                                        <div className="flex items-center justify-center space-x-4">
                                            <Link to={`/invoices/${invoice.invoiceNumber}`} className="text-gray-500 hover:text-indigo-600" title="View Details">
                                                <FaEye />
                                            </Link>
                                            <button className="text-gray-500 hover:text-blue-600" title="Edit Invoice">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => removeInvoice(invoice.invoiceNumber)} className="text-gray-500 hover:text-red-600" title="Delete Invoice">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6">
                        <InvoiceForm onSave={handleCreateInvoice} onCancel={() => setIsModalOpen(false)} isLoading={formLoading} />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default Invoices;