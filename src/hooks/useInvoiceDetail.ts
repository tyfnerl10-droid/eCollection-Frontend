// src/hooks/useInvoiceDetail.ts
import { useState, useEffect, useCallback } from 'react';
import { getInvoiceByNumber, updateInvoice } from '../services/api';
import type { Invoice, UpdateInvoiceData } from '../types';

export const useInvoiceDetail = (invoiceNumber: string | undefined) => {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoice = useCallback(async () => {
        if (!invoiceNumber) return;
        try {
            setLoading(true);
            const data = await getInvoiceByNumber(invoiceNumber);
            setInvoice(data);
        } catch (err) {
            console.error("Failed to fetch invoice details:", err);
            setError('Failed to fetch invoice details.');
        }
        finally { setLoading(false); }
    }, [invoiceNumber]);

    useEffect(() => {
        fetchInvoice();
    }, [fetchInvoice]);

    const saveInvoice = async (invoiceData: UpdateInvoiceData) => {
        if (!invoiceNumber) return;
        await updateInvoice(invoiceNumber, invoiceData);
        await fetchInvoice(); 
    };

    return { invoice, loading, error, saveInvoice };
};