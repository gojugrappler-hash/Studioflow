'use client';

import { Zap, Clock, Play, MoreVertical } from 'lucide-react';
import type { Automation, TriggerType } from '@/types/database';

const TRIGGER_LABELS: Record<TriggerType, string> = {
  contact_created: 'Contact Created',
  contact_updated: 'Contact Updated',
  deal_stage_changed: 'Deal Stage Changed',
  deal_created: 'Deal Created',
  form_submitted: 'Form Submitted',
  task_completed: 'Task Completed',
  invoice_paid: 'Invoice Paid',
  manual: 'Manual',
  webhook_received: 'Webhook',
  scheduled: 'Scheduled',
};

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string, active: boolean) => void;
  onClick: (id: string) => void;
}

export default function AutomationCard({ automation, onToggle, onClick }: AutomationCardProps) {
  return (
    <div
      onClick={() => onClick(automation.id)}
      className="rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'var(--bg-card)',
        borderColor: automation.is_active ? 'var(--accent-teal)' : 'var(--border)',
        borderWidth: automation.is_active ? '1.5px' : '1px',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: automation.is_active ? 'rgba(45,212,191,0.15)' : 'rgba(136,136,160,0.1)' }}>
            <Zap size={16} style={{ color: automation.is_active ? 'var(--accent-teal)' : 'var(--text-secondary)' }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{automation.name}</h3>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {TRIGGER_LABELS[automation.trigger_type]}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(automation.id, !automation.is_active); }}
          className="relative w-10 h-5 rounded-full transition-colors duration-200"
          style={{ background: automation.is_active ? 'var(--accent-teal)' : 'var(--border)' }}
          aria-label={automation.is_active ? 'Deactivate automation' : 'Activate automation'}
        >
          <span
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
            style={{ transform: automation.is_active ? 'translateX(22px)' : 'translateX(2px)' }}
          />
        </button>
      </div>

      {automation.description && (
        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{automation.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-1">
          <Play size={12} /> {automation.run_count} runs
        </span>
        {automation.last_run_at && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> {new Date(automation.last_run_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
