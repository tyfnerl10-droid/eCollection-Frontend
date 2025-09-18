import { useState, useEffect, useCallback } from 'react';
import { getInvoices, createInvoice, deleteInvoice } from '../services/api';
import type { Invoice, CreateInvoiceData } from '../types'; 
import axios from 'axios';

export const useInvoices = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getInvoices();
            setInvoices(data);
        } catch (err) {
            console.error("Failed to add invoice:",err);
            setError('Failed to fetch invoices.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const addInvoice = async (invoiceData: CreateInvoiceData) => {
        try {
            await createInvoice(invoiceData);
            await fetchInvoices(); 
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {

                console.error("Failed to add invoice. API Response:", err.response.data);
            } else {
                console.error("Failed to add invoice (non-API error):", err);
            }
        }
    };

    const removeInvoice = async (invoiceNumber: string) => {
        if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
            return;
        }
        try {
            await deleteInvoice(invoiceNumber);
            await fetchInvoices(); 
        } catch (err) {
            console.error("Failed to remove invoice:", err);
            throw err;
        }
    };

    return { invoices, loading, error, addInvoice, removeInvoice };
};