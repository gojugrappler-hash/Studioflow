'use client';

import { Mail, Clock, Eye, Send, Reply, Forward, Trash2, ExternalLink } from 'lucide-react';
import type { EmailMessage } from '@/types/database';

interface EmailPreviewProps {
  email: EmailMessage | null;
  onReply?: (email: EmailMessage) => void;
  onDelete?: (id: string) => void;
}

export default function EmailPreview({ email, onReply, onDelete }: EmailPreviewProps) {
  if (!email) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-secondary)', gap: '12px',
      }}>
        <Mail size={48} style={{ opacity: 0.3 }} />
        <p style={{ fontSize: '15px' }}>Select an email to preview</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          {email.subject}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '16px', fontWeight: 600,
            }}>
              {(email.to_name || email.to_email)[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                To: {email.to_name || email.to_email}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{email.to_email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <Clock size={14} />
            {formatDate(email.sent_at || email.created_at)}
          </div>
        </div>
        {email.opened_at && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: 'var(--accent-teal)', fontSize: '12px' }}>
            <Eye size={12} /> Opened {formatDate(email.opened_at)}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        <div
          style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.7', maxWidth: '640px' }}
          dangerouslySetInnerHTML={{ __html: email.body_html }}
        />
      </div>

      {/* Actions */}
      <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
        <button onClick={() => onReply?.(email)} style={{
          padding: '8px 16px', background: 'var(--accent-indigo)', color: '#fff', border: 'none',
          borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Reply size={14} /> Reply
        </button>
        <button style={{
          padding: '8px 16px', background: 'var(--bg-secondary)', color: 'var(--text-primary)',
          border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Forward size={14} /> Forward
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={() => onDelete?.(email.id)} style={{
          padding: '8px 12px', background: 'none', color: 'var(--error)', border: '1px solid var(--border)',
          borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px',
        }}>
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
