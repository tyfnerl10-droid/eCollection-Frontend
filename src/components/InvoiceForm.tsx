// Konum: src/components/InvoiceForm.tsx

import { useState, FormEvent, ChangeEvent } from 'react';
import type { CreateInvoiceData, UpdateInvoiceData } from '../types';

// Bu formun hem yeni fatura hem de d�zenleme i�in kullan�ld���n� varsay�yoruz.
// Bu y�zden formData'n�n tipini hem Create hem de Update tiplerini i�erecek �ekilde ayarl�yoruz.
type FormData = Omit<CreateInvoiceData, 'amount'> & { amount: number | string };

interface InvoiceFormProps {
    onSave: (invoiceData: CreateInvoiceData | UpdateInvoiceData) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
    initialData?: UpdateInvoiceData;
}

const InvoiceForm = ({ onSave, onCancel, isLoading, initialData }: InvoiceFormProps) => {

    // Varsay�lan olarak 7 g�n sonras� i�in bir tarih olu�turan yard�mc� fonksiyon
    const getFutureDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0]; // "YYYY-MM-DD" format�n� d�nd�r�r
    };

    // Ba�lang�� state'ini initialData'ya g�re veya bo� olarak ayarla.
    // 'amount' alan�n�, kullan�c� bo� b�rakt���nda 'string' olabilmesi i�in
    // ayr� bir tiple y�netiyoruz.
    const [formData, setFormData] = useState<FormData>(initialData || {
        invoiceNumber: '',
        description: '',
        amount: '', // Ba�lang��ta bo� string olsun ki placeholder g�r�ns�n
        dueDate: getFutureDate(),
    });

    const isEditMode = !!initialData;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // G�ndermeden �nce 'amount'u say�ya �evirerek backend'in bekledi�i
        // CreateInvoiceData veya UpdateInvoiceData format�na uygun hale getir.
        const dataToSend = {
            ...formData,
            amount: parseFloat(String(formData.amount)) || 0,
        };

        await onSave(dataToSend);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? `Edit Invoice #${initialData?.invoiceNumber}` : "Create New Invoice"}
            </h2>

            <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-md px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={isEditMode}
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full mt-1 border rounded-md px-3 py-2" required />
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-md px-3 py-2"
                    required
                />
            </div>
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full mt-1 border rounded-md px-3 py-2"
                    required
                />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isLoading ? 'Saving...' : (isEditMode ? 'Update Invoice' : 'Save Invoice')}
                </button>
            </div>
        </form>
    );
};

export default InvoiceForm;