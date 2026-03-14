'use client';

import { UserPlus, DollarSign, Mail, CheckCircle, FileText, Zap } from 'lucide-react';

const MOCK_ACTIVITIES = [
  { id: '1', icon: <UserPlus size={14} />, color: 'var(--accent-teal)', text: 'New contact Sarah Johnson added', time: '5 min ago' },
  { id: '2', icon: <DollarSign size={14} />, color: 'var(--accent-indigo)', text: 'Deal "Full Sleeve" moved to Proposal', time: '12 min ago' },
  { id: '3', icon: <Mail size={14} />, color: 'var(--accent-blue)', text: 'Follow-up email sent to Mike Chen', time: '28 min ago' },
  { id: '4', icon: <CheckCircle size={14} />, color: 'var(--success)', text: 'Task "Update portfolio" completed', time: '1 hr ago' },
  { id: '5', icon: <FileText size={14} />, color: 'var(--warning)', text: 'Invoice #1042 sent to Lisa Park ($850)', time: '2 hr ago' },
  { id: '6', icon: <Zap size={14} />, color: 'var(--accent-purple)', text: 'Automation "Welcome Email" triggered', time: '3 hr ago' },
  { id: '7', icon: <UserPlus size={14} />, color: 'var(--accent-teal)', text: 'Form submission from website lead', time: '4 hr ago' },
];

export default function ActivityFeed() {
  return (
    <div className="glass-card p-5 rounded-xl">
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
      <div className="space-y-1">
        {MOCK_ACTIVITIES.map((a) => (
          <div key={a.id} className="flex items-start gap-3 py-2 rounded-lg px-2 transition-colors hover:bg-[var(--bg-card-hover)]">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: a.color + '20' }}>
              <span style={{ color: a.color }}>{a.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{a.text}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
