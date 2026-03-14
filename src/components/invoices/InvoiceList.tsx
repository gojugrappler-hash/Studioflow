'use client';

import { Eye, Trash2, Send, MoreHorizontal } from 'lucide-react';
import { PaymentBadge } from './PaymentBadge';
import type { Invoice } from '@/types/database';

interface InvoiceListProps {
  invoices: Invoice[];
  onView: (id: string) => void;
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getContactName(invoice: Invoice): string {
  if (invoice.contact) {
    return `${invoice.contact.first_name} ${invoice.contact.last_name}`.trim();
  }
  return 'No client';
}

export function InvoiceList({ invoices, onView, onSend, onDelete }: InvoiceListProps) {
  if (invoices.length === 0) return null;

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      {/* Table Header */}
      <div
        className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2.5 text-xs font-medium border-b"
        style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', background: 'var(--bg-card)' }}
      >
        <span>Invoice #</span>
        <span>Client</span>
        <span>Date</span>
        <span>Total</span>
        <span>Status</span>
        <span className="w-20">Actions</span>
      </div>

      {/* Rows */}
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-white/[0.02] transition-colors cursor-pointer"
          style={{ borderColor: 'var(--border)' }}
          onClick={() => onView(invoice.id)}
        >
          <span className="font-mono text-sm font-medium" style={{ color: 'var(--accent-indigo)' }}>
            {invoice.invoice_number}
          </span>
          <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {getContactName(invoice)}
          </span>
          <span className="hidden md:block text-sm" style={{ color: 'var(--text-secondary)' }}>
            {formatDate(invoice.issue_date)}
          </span>
          <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(Number(invoice.total))}
          </span>
          <span className="hidden md:block">
            <PaymentBadge status={invoice.status} />
          </span>
          <div className="hidden md:flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onView(invoice.id)}
              className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
              aria-label="View invoice"
            >
              <Eye size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            {invoice.status === 'draft' && (
              <button
                onClick={() => onSend(invoice.id)}
                className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                aria-label="Send invoice"
              >
                <Send size={14} style={{ color: 'var(--accent-blue)' }} />
              </button>
            )}
            <button
              onClick={() => onDelete(invoice.id)}
              className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
              aria-label="Delete invoice"
            >
              <Trash2 size={14} style={{ color: 'var(--error)' }} />
            </button>
          </div>
          {/* Mobile status row */}
          <div className="md:hidden col-span-2 flex items-center justify-between">
            <PaymentBadge status={invoice.status} />
            <button className="p-1" aria-label="More actions">
              <MoreHorizontal size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
