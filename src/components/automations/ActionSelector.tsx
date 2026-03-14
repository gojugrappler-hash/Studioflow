'use client';

import { Mail, ListTodo, Edit3, Tag, X, Activity, ArrowRightLeft, Globe, Clock, GitBranch } from 'lucide-react';
import type { StepType } from '@/types/database';

const ACTION_OPTIONS: { type: StepType; label: string; description: string; icon: React.ReactNode }[] = [
  { type: 'send_email', label: 'Send Email', description: 'Send an automated email', icon: <Mail size={20} /> },
  { type: 'create_task', label: 'Create Task', description: 'Create a new task', icon: <ListTodo size={20} /> },
  { type: 'update_field', label: 'Update Field', description: 'Change a record field value', icon: <Edit3 size={20} /> },
  { type: 'add_tag', label: 'Add Tag', description: 'Add a tag to the record', icon: <Tag size={20} /> },
  { type: 'remove_tag', label: 'Remove Tag', description: 'Remove a tag from the record', icon: <X size={20} /> },
  { type: 'change_status', label: 'Change Status', description: 'Update contact/deal status', icon: <Activity size={20} /> },
  { type: 'change_deal_stage', label: 'Move Deal Stage', description: 'Move a deal to another stage', icon: <ArrowRightLeft size={20} /> },
  { type: 'send_webhook', label: 'Send Webhook', description: 'POST data to an external URL', icon: <Globe size={20} /> },
  { type: 'wait', label: 'Wait / Delay', description: 'Pause before next step', icon: <Clock size={20} /> },
  { type: 'condition', label: 'Condition', description: 'Branch based on a condition', icon: <GitBranch size={20} /> },
];

interface ActionSelectorProps {
  onSelect: (action: StepType) => void;
}

export default function ActionSelector({ onSelect }: ActionSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ACTION_OPTIONS.map((opt) => (
        <button
          key={opt.type}
          type="button"
          onClick={() => onSelect(opt.type)}
          className="flex items-start gap-3 p-4 rounded-lg border text-left transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          <span className="mt-0.5 shrink-0" style={{ color: 'var(--accent-teal)' }}>{opt.icon}</span>
          <div>
            <div className="font-medium text-sm">{opt.label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{opt.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
