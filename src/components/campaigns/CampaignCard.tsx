'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, BarChart3, Edit, Trash2 } from 'lucide-react';
import type { Campaign } from '@/types/database';

const typeConfig: Record<string, { color: string; bg: string }> = {
  email: { color: 'var(--accent-blue)', bg: 'rgba(96, 165, 250, 0.1)' },
  social: { color: 'var(--accent-pink)', bg: 'rgba(244, 114, 182, 0.1)' },
  mixed: { color: 'var(--accent-purple)', bg: 'rgba(167, 139, 250, 0.1)' },
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  draft: { color: 'var(--text-tertiary)', bg: 'rgba(90, 90, 114, 0.1)' },
  active: { color: 'var(--success)', bg: 'var(--success-bg)' },
  paused: { color: 'var(--warning)', bg: 'var(--warning-bg)' },
  completed: { color: 'var(--accent-indigo)', bg: 'var(--info-bg)' },
};

interface CampaignCardProps {
  campaign: Campaign;
  index?: number;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

export function CampaignCard({ campaign, index = 0, onEdit, onDelete }: CampaignCardProps) {
  const typeC = typeConfig[campaign.type] || typeConfig.email;
  const statusC = statusConfig[campaign.status] || statusConfig.draft;
  const dateRange = [
    campaign.start_date ? new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
    campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
  ].filter(Boolean).join(' - ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="glass-card p-4 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{campaign.name}</h4>
          <div className="flex items-center gap-2">
            <span className="badge text-[10px]" style={{ background: typeC.bg, color: typeC.color }}>{campaign.type}</span>
            <span className="badge text-[10px]" style={{ background: statusC.bg, color: statusC.color }}>{campaign.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(campaign)} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }} aria-label="Edit"><Edit size={13} /></button>
          <button onClick={() => onDelete(campaign.id)} className="p-1 rounded" style={{ color: 'var(--error)' }} aria-label="Delete"><Trash2 size={13} /></button>
        </div>
      </div>

      {campaign.description && (
        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{campaign.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {dateRange && <span className="flex items-center gap-1"><Calendar size={11} />{dateRange}</span>}
        <span className="flex items-center gap-1"><Users size={11} />{campaign.contact_count || 0} contacts</span>
        {campaign.budget > 0 && <span className="flex items-center gap-1"><DollarSign size={11} />${campaign.budget}</span>}
      </div>
    </motion.div>
  );
}