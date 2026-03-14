'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Deal, Contact, PipelineStage } from '@/types/database';

interface DealFormProps {
  deal?: Deal | null;
  stages: PipelineStage[];
  contacts: Contact[];
  pipelineId: string;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Deal>) => Promise<void>;
}

export function DealForm({ deal, stages, contacts, pipelineId, open, onClose, onSave }: DealFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: deal?.title || '',
    value: deal?.value?.toString() || '0',
    stage_id: deal?.stage_id || (stages[0]?.id || ''),
    contact_id: deal?.contact_id || '',
    expected_close_date: deal?.expected_close_date || '',
    notes: deal?.notes || '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        title: form.title,
        value: parseFloat(form.value) || 0,
        stage_id: form.stage_id || null,
        contact_id: form.contact_id || null,
        expected_close_date: form.expected_close_date || null,
        notes: form.notes || null,
        pipeline_id: pipelineId,
      });
      onClose();
    } catch (err) {
      console.error('Save deal error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md z-50 overflow-y-auto"
            style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{deal ? 'Edit Deal' : 'New Deal'}</h3>
              <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Deal Title *</label>
                <input value={form.title} onChange={e => update('title', e.target.value)} required placeholder="e.g. Full sleeve tattoo" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Value ($)</label>
                <input type="number" value={form.value} onChange={e => update('value', e.target.value)} placeholder="0.00" min="0" step="0.01" style={{ fontFamily: 'var(--font-mono)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Stage</label>
                <select value={form.stage_id} onChange={e => update('stage_id', e.target.value)}>
                  {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Contact</label>
                <select value={form.contact_id} onChange={e => update('contact_id', e.target.value)}>
                  <option value="">No contact linked</option>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Expected Close Date</label>
                <input type="date" value={form.expected_close_date} onChange={e => update('expected_close_date', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
                <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Deal notes..." />
              </div>
              <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
                <motion.button type="submit" disabled={loading} className="btn btn-primary flex-1" whileTap={{ scale: 0.98 }}>
                  {loading ? 'Saving...' : deal ? 'Update' : 'Create Deal'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
