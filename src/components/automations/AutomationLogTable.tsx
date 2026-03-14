'use client';

import { CheckCircle, XCircle, Clock, SkipForward } from 'lucide-react';
import type { AutomationLog } from '@/types/database';

interface AutomationLogTableProps {
  logs: AutomationLog[];
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  success: { icon: <CheckCircle size={14} />, color: 'var(--success)', label: 'Success' },
  failed: { icon: <XCircle size={14} />, color: 'var(--error)', label: 'Failed' },
  running: { icon: <Clock size={14} />, color: 'var(--warning)', label: 'Running' },
  skipped: { icon: <SkipForward size={14} />, color: 'var(--text-secondary)', label: 'Skipped' },
};

export default function AutomationLogTable({ logs }: AutomationLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
        <Clock size={32} className="mx-auto mb-2" style={{ opacity: 0.5 }} />
        <p className="text-sm">No execution history yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
            <th className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Triggered By</th>
            <th className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Steps</th>
            <th className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Started</th>
            <th className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Error</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG.running;
            return (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="py-2 px-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: cfg.color }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </td>
                <td className="py-2 px-3" style={{ color: 'var(--text-primary)' }}>{log.triggered_by || 'System'}</td>
                <td className="py-2 px-3" style={{ color: 'var(--text-primary)' }}>{log.steps_completed}</td>
                <td className="py-2 px-3" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(log.started_at).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-xs max-w-[200px] truncate" style={{ color: 'var(--error)' }}>
                  {log.error_message || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
