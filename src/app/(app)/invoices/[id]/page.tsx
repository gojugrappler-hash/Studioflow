'use client';

import { useState, useEffect, use } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';
import type { Invoice } from '@/types/database';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchInvoice, sendInvoice, recordPayment } = useInvoices();

  useEffect(() => {
    setLoading(true);
    fetchInvoice(id).then((inv) => {
      setInvoice(inv);
      setLoading(false);
    });
  }, [id, fetchInvoice]);

  const handleSend = async (invoiceId: string) => {
    await sendInvoice(invoiceId);
    const updated = await fetchInvoice(invoiceId);
    setInvoice(updated);
  };

  const handleRecordPayment = async (invoiceId: string) => {
    if (!invoice) return;
    await recordPayment(invoiceId, { amount: Number(invoice.total), method: 'other' });
    const updated = await fetchInvoice(invoiceId);
    setInvoice(updated);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-32 rounded-lg animate-pulse" style={{ background: 'var(--bg-card)' }} />
        <div className="h-96 rounded-xl animate-pulse" style={{ background: 'var(--bg-card)' }} />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Invoice not found</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>This invoice may have been deleted.</p>
      </div>
    );
  }

  return (
    <InvoiceDetail
      invoice={invoice}
      onBack={() => window.history.back()}
      onSend={handleSend}
      onRecordPayment={handleRecordPayment}
    />
  );
}