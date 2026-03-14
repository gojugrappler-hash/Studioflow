'use client';

import { ChevronRight } from 'lucide-react';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export default function ReportCard({ title, description, icon, color, onClick }: ReportCardProps) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-5 rounded-xl text-left w-full transition-all duration-200 hover:scale-[1.02] group"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: color + '20' }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-secondary)' }} />
      </div>
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </button>
  );
}
