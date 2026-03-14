'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Plus, GripVertical, Trash2 } from 'lucide-react';
import type { Form, FormField, FormFieldType } from '@/types/database';

const fieldTypes: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
];

interface FormBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: Partial<Form>) => void;
  editing?: Form | null;
}

export function FormBuilder({ open, onClose, onSave, editing }: FormBuilderProps) {
  const [name, setName] = useState(editing?.name || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [successMessage, setSuccessMessage] = useState(editing?.success_message || 'Thank you for your submission!');
  const [fields, setFields] = useState<FormField[]>(editing?.fields || []);
  const [saving, setSaving] = useState(false);

  const addField = (type: FormFieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1) + ' Field',
      placeholder: '',
      required: false,
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        ...editing,
        name,
        description: description || null,
        success_message: successMessage,
        fields,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg overflow-y-auto"
            style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{editing ? 'Edit Form' : 'New Form'}</h3>
                <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }}><X size={20} /></button>
              </div>

              <div className="space-y-4 mb-6">
                <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Form Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contact Form" /></div>
                <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" rows={2} /></div>
                <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Success Message</label><input value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)} /></div>
              </div>

              <hr style={{ borderColor: 'var(--border)' }} />
              <div className="mt-4 mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Fields ({fields.length})</p>
              </div>

              {/* Field list */}
              <div className="space-y-2 mb-4">
                {fields.map((field) => (
                  <div key={field.id} className="glass-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical size={14} style={{ color: 'var(--text-tertiary)', cursor: 'grab' }} />
                      <span className="badge text-[10px]" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>{field.type}</span>
                      <input className="flex-1 text-xs" value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} style={{ padding: '4px 8px' }} />
                      <label className="flex items-center gap-1 text-[10px] cursor-pointer" style={{ color: 'var(--text-tertiary)' }}>
                        <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })} />
                        Req
                      </label>
                      <button onClick={() => removeField(field.id)} className="p-0.5" style={{ color: 'var(--error)' }}><Trash2 size={12} /></button>
                    </div>
                    {field.type === 'select' && field.options && (
                      <input className="text-[10px] w-full mt-1" value={field.options.join(', ')} onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map((s) => s.trim()) })} placeholder="Option 1, Option 2, ..." style={{ padding: '3px 6px' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Add field buttons */}
              <div className="flex flex-wrap gap-1 mb-6">
                {fieldTypes.map((ft) => (
                  <button key={ft.value} onClick={() => addField(ft.value)} className="btn btn-ghost text-[10px] px-2 py-1">
                    <Plus size={10} /> {ft.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} className="btn btn-primary flex-1" disabled={saving || !name.trim() || fields.length === 0}>{editing ? 'Update' : 'Create'} Form</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}