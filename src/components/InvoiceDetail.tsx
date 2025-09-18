// src/components/InvoiceDetail.tsx
import { useParams, Link } from 'react-router-dom';
import { useInvoiceDetail } from '../hooks/useInvoiceDetail';
import { FaEdit } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import InvoiceForm from './InvoiceForm'; // Mevcut formumuzu kullanacaðýz
import { useState } from 'react';
import { UpdateInvoiceData } from '../types';

const InvoiceDetail = () => {
    const { invoiceNumber } = useParams<{ invoiceNumber: string }>();
    const { invoice, loading, error, saveInvoice } = useInvoiceDetail(invoiceNumber);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const handleUpdateInvoice = async (invoiceData: UpdateInvoiceData) => {
        setFormLoading(true);
        try {
            await saveInvoice(invoiceData);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to update invoice:", err);
            alert('Failed to update invoice.');
        }
        finally { setFormLoading(false); }
    };

    if (loading) return <p>Loading details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!invoice) return <p>Invoice not found.</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                to="/invoices"
                className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Invoices
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Invoice {invoice.invoiceNumber}</h1>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center">
                        <FaEdit className="mr-2" /> Edit
                    </button>
                </div>
                <hr className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                    <p><strong>Description:</strong> {invoice.description}</p>
                    <p><strong>Amount:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)}</p>
                    <p><strong>Status:</strong> {invoice.status}</p>
                    <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
            </div>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6">
                        <InvoiceForm
                            onSave={handleUpdateInvoice}
                            onCancel={() => setIsModalOpen(false)}
                            isLoading={formLoading}
                            initialData={invoice} 
                        />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default InvoiceDetail;