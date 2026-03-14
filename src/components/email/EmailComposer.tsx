'use client';

import { useState, useCallback } from 'react';
import { X, Send, Save, Sparkles, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import { useEmail } from '@/hooks/useEmail';
import type { EmailMessage, Contact } from '@/types/database';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSent?: (email: EmailMessage) => void;
  replyTo?: EmailMessage | null;
  contact?: Contact | null;
}

export default function EmailComposer({ isOpen, onClose, onSent, replyTo, contact }: EmailComposerProps) {
  const { sendEmail, saveDraft } = useEmail();
  const [to, setTo] = useState(replyTo?.to_email || contact?.email || '');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [sending, setSending] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleSend = useCallback(async () => {
    if (!to || !subject) return;
    setSending(true);
    try {
      const email = await sendEmail({
        to_email: to,
        to_name: contact ? `${contact.first_name} ${contact.last_name}` : null,
        from_email: 'hello@studio.com',
        from_name: 'My Studio',
        cc: cc ? cc.split(',').map(s => s.trim()) : [],
        bcc: bcc ? bcc.split(',').map(s => s.trim()) : [],
        subject,
        body_html: `<div>${body.replace(/\n/g, '<br>')}</div>`,
        contact_id: contact?.id || null,
      });
      onSent?.(email);
      onClose();
    } catch (err) {
      console.error('Failed to send:', err);
    }
    setSending(false);
  }, [to, subject, body, cc, bcc, contact, sendEmail, onSent, onClose]);

  const handleSaveDraft = useCallback(async () => {
    try {
      await saveDraft({
        to_email: to, to_name: null, from_email: 'hello@studio.com', from_name: 'My Studio',
        cc: cc ? cc.split(',').map(s => s.trim()) : [], bcc: bcc ? bcc.split(',').map(s => s.trim()) : [],
        subject, body_html: `<div>${body.replace(/\n/g, '<br>')}</div>`, contact_id: contact?.id || null,
      });
      onClose();
    } catch (err) { console.error('Failed to save draft:', err); }
  }, [to, subject, body, cc, bcc, contact, saveDraft, onClose]);

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
  };

  return (
    <div style={{
      position: 'fixed', bottom: 0, right: '24px', width: '560px', maxHeight: '80vh',
      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px 12px 0 0',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', flexDirection: 'column',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '12px 12px 0 0',
      }}>
        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>New Email</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' }}>
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '40px' }}>To</label>
          <input type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@email.com" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={() => setShowCc(!showCc)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
            {showCc ? <ChevronUp size={14} /> : 'Cc/Bcc'}
          </button>
        </div>

        {showCc && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '40px' }}>Cc</label>
              <input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="cc@email.com" style={{ ...inputStyle, flex: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '40px' }}>Bcc</label>
              <input value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="bcc@email.com" style={{ ...inputStyle, flex: 1 }} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', width: '40px' }}>Sub</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject..." style={{ ...inputStyle, flex: 1 }} />
        </div>

        {/* Body */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
          rows={10}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '200px', fontFamily: 'inherit', lineHeight: '1.6' }}
        />

        {/* AI Assist */}
        {showAI && (
          <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--accent-indigo)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-indigo)', fontSize: '13px', fontWeight: 600 }}>
              <Sparkles size={14} />
              AI Email Writer
            </div>
            <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Describe what you want to say..." style={inputStyle} />
            <button
              onClick={() => {
                setBody(`Dear ${to.split('@')[0]},\n\nThank you for your interest in our services. I wanted to follow up on our recent conversation and share some additional details.\n\nPlease don't hesitate to reach out if you have any questions.\n\nBest regards`);
                setShowAI(false);
              }}
              style={{
                padding: '8px 16px', background: 'var(--accent-indigo)', color: '#fff', border: 'none',
                borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, alignSelf: 'flex-end',
              }}
            >
              Generate
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setShowAI(!showAI)} title="AI Assist" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: showAI ? 'var(--accent-indigo)' : 'var(--text-secondary)', borderRadius: '6px' }}>
            <Sparkles size={18} />
          </button>
          <button title="Attach" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', borderRadius: '6px' }}>
            <Paperclip size={18} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSaveDraft} style={{
            padding: '8px 16px', background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
            fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Save size={14} /> Draft
          </button>
          <button onClick={handleSend} disabled={sending || !to || !subject} style={{
            padding: '8px 20px', background: 'var(--accent-indigo)', color: '#fff', border: 'none',
            borderRadius: '8px', cursor: sending ? 'not-allowed' : 'pointer', fontSize: '13px',
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
            opacity: (!to || !subject) ? 0.5 : 1,
          }}>
            <Send size={14} /> {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
