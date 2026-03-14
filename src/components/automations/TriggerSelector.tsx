'use client';

import { Zap, UserPlus, DollarSign, FileText, CheckCircle, Receipt, Globe, Clock, MousePointer } from 'lucide-react';
import type { TriggerType } from '@/types/database';

const TRIGGER_OPTIONS: { type: TriggerType; label: string; description: string; icon: React.ReactNode }[] = [
  { type: 'contact_created', label: 'Contact Created', description: 'When a new contact is added', icon: <UserPlus size={20} /> },
  { type: 'contact_updated', label: 'Contact Updated', description: 'When a contact record changes', icon: <UserPlus size={20} /> },
  { type: 'deal_created', label: 'Deal Created', description: 'When a new deal is added', icon: <DollarSign size={20} /> },
  { type: 'deal_stage_changed', label: 'Deal Stage Changed', description: 'When a deal moves stages', icon: <DollarSign size={20} /> },
  { type: 'form_submitted', label: 'Form Submitted', description: 'When a lead form is submitted', icon: <FileText size={20} /> },
  { type: 'task_completed', label: 'Task Completed', description: 'When a task is marked done', icon: <CheckCircle size={20} /> },
  { type: 'invoice_paid', label: 'Invoice Paid', description: 'When an invoice is paid', icon: <Receipt size={20} /> },
  { type: 'webhook_received', label: 'Webhook Received', description: 'When an external webhook arrives', icon: <Globe size={20} /> },
  { type: 'scheduled', label: 'Scheduled', description: 'Runs on a set schedule', icon: <Clock size={20} /> },
  { type: 'manual', label: 'Manual Trigger', description: 'Run manually by a user', icon: <MousePointer size={20} /> },
];

interface TriggerSelectorProps {
  selected: TriggerType | null;
  onSelect: (trigger: TriggerType) => void;
}

export default function TriggerSelector({ selected, onSelect }: TriggerSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {TRIGGER_OPTIONS.map((opt) => (
        <button
          key={opt.type}
          type="button"
          onClick={() => onSelect(opt.type)}
          className="flex items-start gap-3 p-4 rounded-lg border text-left transition-all duration-200"
          style={{
            background: selected === opt.type ? 'var(--accent-indigo)' : 'var(--bg-card)',
            borderColor: selected === opt.type ? 'var(--accent-indigo)' : 'var(--border)',
            color: selected === opt.type ? '#fff' : 'var(--text-primary)',
          }}
        >
          <span className="mt-0.5 shrink-0" style={{ opacity: 0.8 }}>{opt.icon}</span>
          <div>
            <div className="font-medium text-sm">{opt.label}</div>
            <div className="text-xs mt-0.5" style={{ opacity: 0.7 }}>{opt.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
