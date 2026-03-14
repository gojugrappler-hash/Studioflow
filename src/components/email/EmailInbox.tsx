'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Search, Star, Trash2, Send, FileEdit, Eye, Clock, AlertCircle, CheckCircle2, Filter } from 'lucide-react';
import { useEmail } from '@/hooks/useEmail';
import type { EmailMessage, EmailStatus } from '@/types/database';

const STATUS_CONFIG: Record<EmailStatus, { label: string; color: string; icon: typeof Mail }> = {
  draft: { label: 'Draft', color: 'var(--text-secondary)', icon: FileEdit },
  sent: { label: 'Sent', color: 'var(--accent-blue)', icon: Send },
  delivered: { label: 'Delivered', color: 'var(--success)', icon: CheckCircle2 },
  opened: { label: 'Opened', color: 'var(--accent-teal)', icon: Eye },
  bounced: { label: 'Bounced', color: 'var(--warning)', icon: AlertCircle },
  failed: { label: 'Failed', color: 'var(--error)', icon: AlertCircle },
};

interface EmailInboxProps {
  onCompose: () => void;
  onSelectEmail: (email: EmailMessage) => void;
  selectedId?: string;
}

export default function EmailInbox({ onCompose, onSelectEmail, selectedId }: EmailInboxProps) {
  const { fetchEmails } = useEmail();
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadEmails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEmails(search || undefined, filter !== 'all' ? filter : undefined);
      setEmails(data);
    } catch { /* empty */ }
    setLoading(false);
  }, [fetchEmails, search, filter]);

  useEffect(() => { loadEmails(); }, [loadEmails]);

  // Show empty state when no emails
  const displayEmails: EmailMessage[] = emails.length > 0 ? emails : [
    { id: '1', org_id: '', contact_id: null, from_email: 'you@studio.com', from_name: 'You', to_email: 'sarah.johnson@email.com', to_name: 'Sarah Johnson', cc: [], bcc: [], subject: 'Consultation Follow-up — Design Ideas', body_html: '<p>Hi Sarah, thanks for coming in! Here are some design references...</p>', body_text: null, status: 'delivered', template_id: null, deal_id: null, opened_at: null, sent_at: '2026-03-13T14:30:00Z', created_by: null, created_at: '2026-03-13T14:30:00Z', updated_at: '2026-03-13T14:30:00Z', deleted_at: null },
    { id: '2', org_id: '', contact_id: null, from_email: 'you@studio.com', from_name: 'You', to_email: 'mike.chen@email.com', to_name: 'Mike Chen', cc: [], bcc: [], subject: 'Invoice #1042 — Session Payment', body_html: '<p>Hi Mike, please find your invoice attached...</p>', body_text: null, status: 'opened', template_id: null, deal_id: null, opened_at: '2026-03-13T15:00:00Z', sent_at: '2026-03-13T12:00:00Z', created_by: null, created_at: '2026-03-13T12:00:00Z', updated_at: '2026-03-13T15:00:00Z', deleted_at: null },
    { id: '3', org_id: '', contact_id: null, from_email: 'you@studio.com', from_name: 'You', to_email: 'lisa.park@email.com', to_name: 'Lisa Park', cc: [], bcc: [], subject: 'Welcome to the Studio!', body_html: '<p>Welcome Lisa! We\'re excited to work with you...</p>', body_text: null, status: 'sent', template_id: null, deal_id: null, opened_at: null, sent_at: '2026-03-13T10:00:00Z', created_by: null, created_at: '2026-03-13T10:00:00Z', updated_at: '2026-03-13T10:00:00Z', deleted_at: null },
    { id: '4', org_id: '', contact_id: null, from_email: 'you@studio.com', from_name: 'You', to_email: 'alex.rivera@email.com', to_name: 'Alex Rivera', cc: [], bcc: [], subject: 'Appointment Reminder — March 15', body_html: '<p>Hi Alex, just a reminder about your appointment...</p>', body_text: null, status: 'delivered', template_id: null, deal_id: null, opened_at: null, sent_at: '2026-03-12T16:00:00Z', created_by: null, created_at: '2026-03-12T16:00:00Z', updated_at: '2026-03-12T16:00:00Z', deleted_at: null },
    { id: '5', org_id: '', contact_id: null, from_email: 'you@studio.com', from_name: 'You', to_email: 'jordan.taylor@email.com', to_name: 'Jordan Taylor', cc: [], bcc: [], subject: 'Portfolio Update — New Pieces Added', body_html: '<p>Hey Jordan, check out our latest work...</p>', body_text: null, status: 'bounced', template_id: null, deal_id: null, opened_at: null, sent_at: '2026-03-12T09:00:00Z', created_by: null, created_at: '2026-03-12T09:00:00Z', updated_at: '2026-03-12T09:00:00Z', deleted_at: null },
  ];

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHr = diffMs / (1000 * 60 * 60);
    if (diffHr < 1) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffHr < 24) return `${Math.floor(diffHr)}h ago`;
    if (diffHr < 48) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search + Filter */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px',
              border: '1px solid var(--border)', background: 'var(--bg-primary)',
              color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
            }}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
            background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px',
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">All</option>
          <option value="draft">Drafts</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
          <option value="opened">Opened</option>
        </select>
      </div>

      {/* Email List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading && emails.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading emails...
          </div>
        ) : (
          displayEmails.map((email) => {
            const cfg = STATUS_CONFIG[email.status];
            const StatusIcon = cfg.icon;
            const isSelected = selectedId === email.id;
            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                style={{
                  padding: '14px 16px', borderBottom: '1px solid var(--border)',
                  cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start',
                  background: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-card)'; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Avatar */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '14px', fontWeight: 600,
                }}>
                  {(email.to_name || email.to_email)[0].toUpperCase()}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {email.to_name || email.to_email}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flexShrink: 0 }}>
                      {formatTime(email.sent_at || email.created_at)}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {email.subject}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusIcon size={12} style={{ color: cfg.color }} />
                    <span style={{ fontSize: '12px', color: cfg.color }}>{cfg.label}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
