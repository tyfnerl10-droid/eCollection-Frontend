import { useState, useEffect } from 'react';
import { getInvoices } from '../services/api';
import type { Invoice } from '../types';

export const useInvoices = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setError(null);
                setLoading(true);
                const data = await getInvoices();
                setInvoices(data);
            } catch {
                setError('Failed to fetch invoices.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []); 

    return { invoices, loading, error };
};