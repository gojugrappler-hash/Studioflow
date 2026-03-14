'use client';

import { Clock, AlertCircle, Circle, CheckCircle } from 'lucide-react';

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'var(--error)',
  high: 'var(--warning)',
  medium: 'var(--accent-blue)',
  low: 'var(--text-secondary)',
};

const MOCK_TASKS = [
  { id: '1', title: 'Follow up with Sarah J.', priority: 'high', due: 'Today', done: false },
  { id: '2', title: 'Send invoice to Studio 42', priority: 'urgent', due: 'Overdue', done: false },
  { id: '3', title: 'Prepare consultation notes', priority: 'medium', due: 'Tomorrow', done: false },
  { id: '4', title: 'Update portfolio photos', priority: 'low', due: 'Mar 16', done: false },
  { id: '5', title: 'Review campaign results', priority: 'medium', due: 'Mar 17', done: false },
];

export default function UpcomingTasks() {
  return (
    <div className="glass-card p-5 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Upcoming Tasks</h3>
        <a href="/tasks" className="text-xs font-medium" style={{ color: 'var(--accent-indigo)' }}>View all</a>
      </div>
      <div className="space-y-1">
        {MOCK_TASKS.map((t) => (
          <div key={t.id} className="flex items-center gap-3 py-2 px-2 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]">
            <Circle size={16} style={{ color: PRIORITY_COLORS[t.priority] }} />
            <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{t.title}</span>
            <span className="text-xs shrink-0 font-mono" style={{ color: t.due === 'Overdue' ? 'var(--error)' : 'var(--text-secondary)' }}>
              {t.due}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
