'use client';

import { UserPlus, Handshake, ListTodo, FileText, PenLine, Zap } from 'lucide-react';

const ACTIONS = [
  { label: 'Contact', icon: <UserPlus size={18} />, href: '/contacts', color: 'var(--accent-teal)' },
  { label: 'Deal', icon: <Handshake size={18} />, href: '/deals', color: 'var(--accent-indigo)' },
  { label: 'Task', icon: <ListTodo size={18} />, href: '/tasks', color: 'var(--accent-blue)' },
  { label: 'Invoice', icon: <FileText size={18} />, href: '/invoices', color: 'var(--warning)' },
  { label: 'Post', icon: <PenLine size={18} />, href: '/social', color: 'var(--accent-pink)' },
  { label: 'Automation', icon: <Zap size={18} />, href: '/automations', color: 'var(--accent-purple)' },
];

export default function QuickActions() {
  return (
    <div className="glass-card p-5 rounded-xl">
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        {ACTIONS.map((a) => (
          <a
            key={a.label}
            href={a.href}
            className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ background: a.color + '10' }}
          >
            <span style={{ color: a.color }}>{a.icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{a.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
