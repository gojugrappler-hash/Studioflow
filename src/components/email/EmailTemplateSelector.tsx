'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, X, Search, Star, Plus, Eye } from 'lucide-react';
import { useEmail } from '@/hooks/useEmail';
import type { EmailTemplate } from '@/types/database';

const BUILT_IN_TEMPLATES: EmailTemplate[] = [
  {
    id: 't1', org_id: '', name: 'Welcome Email', subject: 'Welcome to {{studio_name}}!',
    body_html: '<h2>Welcome, {{first_name}}!</h2><p>We\'re thrilled to have you as a client. Here\'s what to expect next:</p><ul><li>We\'ll schedule your consultation within 48 hours</li><li>Review our portfolio for inspiration</li><li>Feel free to send any reference images</li></ul><p>Can\'t wait to create something amazing together!</p>',
    category: 'Onboarding', merge_tags: ['first_name', 'studio_name'], is_active: true, usage_count: 24,
    created_by: null, created_at: '', updated_at: '', deleted_at: null,
  },
  {
    id: 't2', org_id: '', name: 'Appointment Reminder', subject: 'Reminder: Your appointment is {{date}}',
    body_html: '<p>Hi {{first_name}},</p><p>Just a friendly reminder that your appointment is scheduled for <strong>{{date}}</strong> at <strong>{{time}}</strong>.</p><p><strong>Location:</strong> {{studio_address}}</p><p><strong>What to bring:</strong></p><ul><li>Photo ID</li><li>Reference images (if any)</li></ul><p>See you soon!</p>',
    category: 'Scheduling', merge_tags: ['first_name', 'date', 'time', 'studio_address'], is_active: true, usage_count: 18,
    created_by: null, created_at: '', updated_at: '', deleted_at: null,
  },
  {
    id: 't3', org_id: '', name: 'Invoice Follow-up', subject: 'Invoice #{{invoice_number}} — Payment Reminder',
    body_html: '<p>Hi {{first_name}},</p><p>This is a friendly reminder that invoice <strong>#{{invoice_number}}</strong> for <strong>{{amount}}</strong> is due on <strong>{{due_date}}</strong>.</p><p>You can pay securely online using the link below:</p><p><a href="{{payment_link}}">Pay Now</a></p><p>If you\'ve already made the payment, please disregard this email.</p>',
    category: 'Billing', merge_tags: ['first_name', 'invoice_number', 'amount', 'due_date', 'payment_link'], is_active: true, usage_count: 12,
    created_by: null, created_at: '', updated_at: '', deleted_at: null,
  },
  {
    id: 't4', org_id: '', name: 'Thank You — After Session', subject: 'Thanks for visiting {{studio_name}}!',
    body_html: '<p>Hi {{first_name}},</p><p>Thank you for your visit! We hope you love the result.</p><p><strong>Aftercare tips:</strong></p><ul><li>Keep the area clean and moisturized</li><li>Avoid direct sunlight for 2 weeks</li><li>Follow up if you notice anything unusual</li></ul><p>We\'d love to see you again! Feel free to book your next session anytime.</p>',
    category: 'Follow-up', merge_tags: ['first_name', 'studio_name'], is_active: true, usage_count: 31,
    created_by: null, created_at: '', updated_at: '', deleted_at: null,
  },
  {
    id: 't5', org_id: '', name: 'Portfolio Update', subject: 'Check out our latest work!',
    body_html: '<p>Hi {{first_name}},</p><p>We\'ve been busy creating some amazing new pieces and wanted to share them with you!</p><p>Check out our updated portfolio on our website or social media.</p><p>Feeling inspired? Book a consultation to discuss your next project.</p><p>Best,<br>{{studio_name}}</p>',
    category: 'Marketing', merge_tags: ['first_name', 'studio_name'], is_active: true, usage_count: 8,
    created_by: null, created_at: '', updated_at: '', deleted_at: null,
  },
];

interface EmailTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: EmailTemplate) => void;
}

export default function EmailTemplateSelector({ isOpen, onClose, onSelect }: EmailTemplateSelectorProps) {
  const { fetchTemplates } = useEmail();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates().then(setTemplates).catch(() => {});
    }
  }, [isOpen, fetchTemplates]);

  const allTemplates = [...templates, ...BUILT_IN_TEMPLATES];
  const filtered = allTemplates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(allTemplates.map((t) => t.category))];
  const previewTemplate = previewId ? allTemplates.find((t) => t.id === previewId) : null;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div style={{
        width: '720px', maxHeight: '80vh', background: 'var(--bg-card)',
        borderRadius: '12px', border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} style={{ color: 'var(--accent-indigo)' }} />
            <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>Email Templates</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>({filtered.length})</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              style={{
                width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-primary)',
                color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
          {/* Template List */}
          <div style={{ flex: 1, padding: '12px' }}>
            {categories.map((cat) => {
              const catTemplates = filtered.filter((t) => t.category === cat);
              if (catTemplates.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px', marginBottom: '8px' }}>
                    {cat}
                  </div>
                  {catTemplates.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        padding: '12px', borderRadius: '8px', cursor: 'pointer',
                        border: '1px solid var(--border)', marginBottom: '6px',
                        background: previewId === t.id ? 'var(--bg-card-hover)' : 'transparent',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => { if (previewId !== t.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{t.name}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={(e) => { e.stopPropagation(); setPreviewId(t.id); }} title="Preview" style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Eye size={14} />
                          </button>
                          <button onClick={() => onSelect(t)} style={{
                            padding: '4px 10px', background: 'var(--accent-indigo)', color: '#fff', border: 'none',
                            borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                          }}>
                            Use
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.subject}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Star size={11} style={{ color: 'var(--warning)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Used {t.usage_count} times</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Preview Panel */}
          {previewTemplate && (
            <div style={{ width: '300px', borderLeft: '1px solid var(--border)', padding: '16px', overflow: 'auto' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Preview</div>
              <div style={{ fontSize: '13px', color: 'var(--accent-indigo)', marginBottom: '4px' }}>{previewTemplate.subject}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: previewTemplate.body_html }} />
              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {previewTemplate.merge_tags.map((tag) => (
                  <span key={tag} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--accent-teal)', border: '1px solid var(--border)' }}>
                    {'{{'}{tag}{'}}'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
