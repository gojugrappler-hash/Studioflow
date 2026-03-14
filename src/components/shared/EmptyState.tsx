'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(129, 140, 248, 0.1))',
          border: '1px solid var(--border)',
        }}
      >
        <Icon size={28} style={{ color: 'var(--accent-teal)' }} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-sm mb-6"
        style={{ color: 'var(--text-secondary)' }}
      >
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-indigo))',
            color: '#0a0a0f',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
