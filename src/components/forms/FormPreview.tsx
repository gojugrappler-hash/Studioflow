'use client';

import type { FormField } from '@/types/database';

interface FormPreviewProps {
  fields: FormField[];
  formName: string;
}

export function FormPreview({ fields, formName }: FormPreviewProps) {
  return (
    <div className="glass-card p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{formName || 'Form Preview'}</h3>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              {field.label}{field.required && <span style={{ color: 'var(--error)' }}> *</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea placeholder={field.placeholder || field.label} rows={3} readOnly />
            ) : field.type === 'select' ? (
              <select defaultValue="">
                <option value="" disabled>Select...</option>
                {(field.options || []).map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                <input type="checkbox" readOnly /> {field.label}
              </label>
            ) : (
              <input type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} placeholder={field.placeholder || field.label} readOnly />
            )}
          </div>
        ))}
        {fields.length > 0 && (
          <button className="btn btn-primary w-full mt-2">Submit</button>
        )}
        {fields.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: 'var(--text-tertiary)' }}>Add fields to see a preview</p>
        )}
      </div>
    </div>
  );
}