'use client';

import { useState } from 'react';
import { Bell, Save } from 'lucide-react';

interface NotifOption {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export default function NotificationSettings() {
  const [options, setOptions] = useState<NotifOption[]>([
    { id: 'task_due', label: 'Task Due', description: 'When a task is approaching its due date', email: true, push: true, inApp: true },
    { id: 'task_assigned', label: 'Task Assigned', description: 'When a task is assigned to you', email: true, push: true, inApp: true },
    { id: 'deal_update', label: 'Deal Updates', description: 'When a deal changes stage', email: false, push: true, inApp: true },
    { id: 'new_lead', label: 'New Lead', description: 'When a new contact or form submission arrives', email: true, push: true, inApp: true },
    { id: 'invoice_paid', label: 'Invoice Paid', description: 'When a client pays an invoice', email: true, push: false, inApp: true },
    { id: 'mention', label: 'Mentions', description: 'When someone mentions you in a note or activity', email: false, push: true, inApp: true },
  ]);

  const toggle = (id: string, channel: 'email' | 'push' | 'inApp') => {
    setOptions((prev) => prev.map((o) => o.id === id ? { ...o, [channel]: !o[channel] } : o));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Bell size={18} style={{ color: 'var(--warning)' }} />
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th className="text-left py-2 px-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Event</th>
              <th className="text-center py-2 px-2 font-medium w-20" style={{ color: 'var(--text-secondary)' }}>Email</th>
              <th className="text-center py-2 px-2 font-medium w-20" style={{ color: 'var(--text-secondary)' }}>Push</th>
              <th className="text-center py-2 px-2 font-medium w-20" style={{ color: 'var(--text-secondary)' }}>In-App</th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt) => (
              <tr key={opt.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="py-3 px-2">
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{opt.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{opt.description}</p>
                </td>
                {(['email', 'push', 'inApp'] as const).map((ch) => (
                  <td key={ch} className="text-center py-3 px-2">
                    <button
                      onClick={() => toggle(opt.id, ch)}
                      className="w-9 h-5 rounded-full transition-colors relative"
                      style={{ background: opt[ch] ? 'var(--accent-teal)' : 'var(--border)' }}
                      aria-label={`Toggle ${ch} for ${opt.label}`}
                    >
                      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: opt[ch] ? 'translateX(18px)' : 'translateX(2px)' }} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn btn-primary flex items-center gap-2"><Save size={16} /> Save Preferences</button>
      </div>
    </div>
  );
}
