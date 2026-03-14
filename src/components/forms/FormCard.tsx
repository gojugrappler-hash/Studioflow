'use client';

import { motion } from 'framer-motion';
import { FileText, Copy, ExternalLink, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Form } from '@/types/database';

interface FormCardProps {
  form: Form;
  index?: number;
  onEdit: (form: Form) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export function FormCard({ form, index = 0, onEdit, onDelete, onToggleActive }: FormCardProps) {
  const fieldCount = Array.isArray(form.fields) ? form.fields.length : 0;
  const embedUrl = typeof window !== 'undefined' ? `${window.location.origin}/f/${form.slug}` : `/f/${form.slug}`;

  const copyEmbed = () => {
    const code = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(code);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="glass-card p-4 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--info-bg)' }}>
            <FileText size={18} style={{ color: 'var(--accent-indigo)' }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{form.name}</h4>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{fieldCount} fields • {form.submission_count} submissions</p>
          </div>
        </div>
        <button
          onClick={() => onToggleActive(form.id, !form.is_active)}
          style={{ color: form.is_active ? 'var(--success)' : 'var(--text-tertiary)' }}
        >
          {form.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
        </button>
      </div>

      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={copyEmbed} className="btn btn-ghost text-xs px-2 py-1" style={{ color: 'var(--text-secondary)' }}><Copy size={11} /> Embed</button>
        <button onClick={() => onEdit(form)} className="btn btn-ghost text-xs px-2 py-1" style={{ color: 'var(--text-secondary)' }}><Edit size={11} /> Edit</button>
        <button onClick={() => onDelete(form.id)} className="btn btn-ghost text-xs px-2 py-1" style={{ color: 'var(--error)' }}><Trash2 size={11} /> Delete</button>
      </div>
    </motion.div>
  );
}