'use client';

import { ArrowLeft, Send, CreditCard, FileText, Calendar, Clock } from 'lucide-react';
import { PaymentBadge } from './PaymentBadge';
import type { Invoice, InvoiceStatus } from '@/types/database';

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
  onSend: (id: string) => void;
  onRecordPayment: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(date: string | null): string {
  if (!date) return '---';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function InvoiceDetail({ invoice, onBack, onSend, onRecordPayment }: InvoiceDetailProps) {
  const contactName = invoice.contact
    ? `${invoice.contact.first_name} ${invoice.contact.last_name}`.trim()
    : 'No client assigned';

  const isOverdue = invoice.due_date && new Date(invoice.due_date) < new Date() && invoice.status !== 'paid' && invoice.status !== 'cancelled';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          Back to Invoices
        </button>
        <div className="flex gap-2">
          {invoice.status === 'draft' && (
            <button
              onClick={() => onSend(invoice.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'var(--accent-blue)' }}
            >
              <Send size={12} />
              Mark as Sent
            </button>
          )}
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <button
              onClick={() => onRecordPayment(invoice.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'var(--success)' }}
            >
              <CreditCard size={12} />
              Record Payment
            </button>
          )}
        </div>
      </div>

      {/* Invoice Card */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold font-mono" style={{ color: 'var(--accent-indigo)' }}>
                  {invoice.invoice_number}
                </h1>
                <PaymentBadge status={isOverdue ? 'overdue' : invoice.status} />
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {contactName}
              </p>
              {invoice.contact?.email && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {invoice.contact.email}
                </p>
              )}
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={12} />
                Issued: {formatDate(invoice.issue_date)}
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: isOverdue ? 'var(--error)' : 'var(--text-secondary)' }}>
                <Clock size={12} />
                Due: {formatDate(invoice.due_date)}
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                <th className="text-left pb-3">Description</th>
                <th className="text-center pb-3 w-20">Qty</th>
                <th className="text-right pb-3 w-28">Unit Price</th>
                <th className="text-right pb-3 w-28">Total</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item) => (
                <tr key={item.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {item.description}
                    {item.product && (
                      <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(129, 140, 248, 0.1)', color: 'var(--accent-indigo)' }}>
                        {item.product.name}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-sm text-center font-mono" style={{ color: 'var(--text-primary)' }}>
                    {Number(item.quantity)}
                  </td>
                  <td className="py-3 text-sm text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(Number(item.unit_price))}
                  </td>
                  <td className="py-3 text-sm text-right font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(Number(item.total))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 pb-6">
          <div className="ml-auto w-64 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(Number(invoice.subtotal))}</span>
            </div>
            {Number(invoice.tax_rate) > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Tax ({invoice.tax_rate}%)</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(Number(invoice.tax_amount))}</span>
              </div>
            )}
            {Number(invoice.discount_amount) > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Discount</span>
                <span className="font-mono" style={{ color: 'var(--success)' }}>-{formatCurrency(Number(invoice.discount_amount))}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-primary)' }}>Total</span>
              <span className="font-mono" style={{ color: 'var(--accent-teal)' }}>{formatCurrency(Number(invoice.total))}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="px-6 pb-6">
            <div className="rounded-lg p-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText size={12} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Notes</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{invoice.notes}</p>
            </div>
          </div>
        )}

        {/* Payments */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Payment History</h3>
            <div className="space-y-2">
              {invoice.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-lg p-3" style={{ background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                  <div>
                    <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                      {payment.method.replace('_', ' ')}
                    </span>
                    <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(payment.paid_at)}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-sm" style={{ color: 'var(--success)' }}>
                    +{formatCurrency(Number(payment.amount))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
