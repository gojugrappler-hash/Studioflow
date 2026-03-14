'use client';

import { useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import type { AutomationStep, StepType } from '@/types/database';

const STEP_LABELS: Record<StepType, string> = {
  send_email: 'Send Email',
  create_task: 'Create Task',
  update_field: 'Update Field',
  add_tag: 'Add Tag',
  remove_tag: 'Remove Tag',
  change_status: 'Change Status',
  change_deal_stage: 'Move Deal Stage',
  send_webhook: 'Send Webhook',
  wait: 'Wait / Delay',
  condition: 'Condition',
};

const STEP_COLORS: Record<string, string> = {
  send_email: 'var(--accent-blue)',
  create_task: 'var(--accent-teal)',
  update_field: 'var(--accent-indigo)',
  add_tag: 'var(--success)',
  remove_tag: 'var(--error)',
  change_status: 'var(--warning)',
  change_deal_stage: 'var(--info)',
  send_webhook: 'var(--accent-blue)',
  wait: 'var(--text-secondary)',
  condition: 'var(--accent-indigo)',
};

interface AutomationStepEditorProps {
  step: AutomationStep;
  index: number;
  onUpdate: (step: AutomationStep) => void;
  onDelete: (stepId: string) => void;
}

export default function AutomationStepEditor({ step, index, onUpdate, onDelete }: AutomationStepEditorProps) {
  const [config, setConfig] = useState<Record<string, string>>(
    (step.config || {}) as Record<string, string>
  );

  const handleConfigChange = (key: string, value: string) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    onUpdate({ ...step, config: updated });
  };

  const renderConfigFields = () => {
    switch (step.step_type) {
      case 'send_email':
        return (
          <>
            <input type="text" placeholder="Email subject" value={config.subject || ''} onChange={(e) => handleConfigChange('subject', e.target.value)} className="sf-input w-full text-sm" />
            <textarea placeholder="Email body (supports merge tags)" value={config.body || ''} onChange={(e) => handleConfigChange('body', e.target.value)} className="sf-input w-full text-sm mt-2" rows={3} />
          </>
        );
      case 'create_task':
        return (
          <>
            <input type="text" placeholder="Task title" value={config.title || ''} onChange={(e) => handleConfigChange('title', e.target.value)} className="sf-input w-full text-sm" />
            <select value={config.priority || 'medium'} onChange={(e) => handleConfigChange('priority', e.target.value)} className="sf-input w-full text-sm mt-2">
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </>
        );
      case 'wait':
        return (
          <div className="flex items-center gap-2">
            <input type="number" min="1" placeholder="Duration" value={config.minutes || ''} onChange={(e) => handleConfigChange('minutes', e.target.value)} className="sf-input w-24 text-sm" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>minutes</span>
          </div>
        );
      case 'send_webhook':
        return <input type="url" placeholder="https://example.com/webhook" value={config.url || ''} onChange={(e) => handleConfigChange('url', e.target.value)} className="sf-input w-full text-sm" />;
      case 'add_tag':
      case 'remove_tag':
        return <input type="text" placeholder="Tag name" value={config.tag || ''} onChange={(e) => handleConfigChange('tag', e.target.value)} className="sf-input w-full text-sm" />;
      case 'change_status':
        return (
          <select value={config.status || ''} onChange={(e) => handleConfigChange('status', e.target.value)} className="sf-input w-full text-sm">
            <option value="">Select status...</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        );
      default:
        return <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Configure this step as needed.</p>;
    }
  };

  return (
    <div className="rounded-lg border p-4 relative" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical size={16} style={{ color: 'var(--text-secondary)', cursor: 'grab' }} />
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: STEP_COLORS[step.step_type] || 'var(--accent-indigo)', color: '#fff' }}>
            Step {index + 1}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {STEP_LABELS[step.step_type] || step.step_type}
          </span>
        </div>
        <button type="button" onClick={() => onDelete(step.id)} className="p-1 rounded hover:bg-red-500/10 transition-colors" style={{ color: 'var(--error)' }}>
          <Trash2 size={16} />
        </button>
      </div>
      {renderConfigFields()}
    </div>
  );
}
