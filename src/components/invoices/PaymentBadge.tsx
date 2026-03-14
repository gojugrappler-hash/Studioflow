'use client';

import type { InvoiceStatus } from '@/types/database';

const statusConfig: Record<InvoiceStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft: { label: 'Draft', bg: 'rgba(136, 136, 160, 0.15)', text: 'var(--text-secondary)', dot: 'var(--text-secondary)' },
  sent: { label: 'Sent', bg: 'rgba(96, 165, 250, 0.15)', text: 'var(--accent-blue)', dot: 'var(--accent-blue)' },
  paid: { label: 'Paid', bg: 'rgba(52, 211, 153, 0.15)', text: 'var(--success)', dot: 'var(--success)' },
  overdue: { label: 'Overdue', bg: 'rgba(248, 113, 113, 0.15)', text: 'var(--error)', dot: 'var(--error)' },
  cancelled: { label: 'Cancelled', bg: 'rgba(136, 136, 160, 0.1)', text: 'var(--text-secondary)', dot: 'var(--text-secondary)' },
};

export function PaymentBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status] || statusConfig.draft;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
}
