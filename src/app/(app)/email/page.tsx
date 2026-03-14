'use client';

import { useState } from 'react';
import { Mail, Plus, FileText } from 'lucide-react';
import EmailInbox from '@/components/email/EmailInbox';
import EmailComposer from '@/components/email/EmailComposer';
import EmailPreview from '@/components/email/EmailPreview';
import EmailTemplateSelector from '@/components/email/EmailTemplateSelector';
import type { EmailMessage, EmailTemplate } from '@/types/database';

export default function EmailPage() {
  const [composerOpen, setComposerOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [replyTo, setReplyTo] = useState<EmailMessage | null>(null);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setTemplateOpen(false);
    setComposerOpen(true);
  };

  const handleReply = (email: EmailMessage) => {
    setReplyTo(email);
    setComposerOpen(true);
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={24} style={{ color: 'var(--accent-indigo)' }} />
            Email
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Send, track, and manage client emails
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setTemplateOpen(true)}
            style={{
              padding: '10px 16px', background: 'var(--bg-card)', color: 'var(--text-primary)',
              border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
          >
            <FileText size={16} /> Templates
          </button>
          <button
            onClick={() => { setReplyTo(null); setComposerOpen(true); }}
            style={{
              padding: '10px 20px', background: 'var(--accent-indigo)', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={16} /> Compose
          </button>
        </div>
      </div>

      {/* Main Content — Split View */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Inbox Panel */}
        <div style={{ width: '380px', borderRight: '1px solid var(--border)', flexShrink: 0, overflow: 'hidden' }}>
          <EmailInbox
            onCompose={() => setComposerOpen(true)}
            onSelectEmail={setSelectedEmail}
            selectedId={selectedEmail?.id}
          />
        </div>

        {/* Preview Panel */}
        <EmailPreview
          email={selectedEmail}
          onReply={handleReply}
        />
      </div>

      {/* Modals */}
      <EmailComposer
        isOpen={composerOpen}
        onClose={() => { setComposerOpen(false); setReplyTo(null); }}
        replyTo={replyTo}
      />
      <EmailTemplateSelector
        isOpen={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onSelect={handleTemplateSelect}
      />
    </div>
  );
}
