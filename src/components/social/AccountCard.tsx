'use client';

import { motion } from 'framer-motion';
import { Unlink, Trash2, ExternalLink } from 'lucide-react';
import type { SocialAccount } from '@/types/database';
import { PlatformBadge, platformConfig } from './PlatformBadge';

interface AccountCardProps {
  account: SocialAccount;
  onDisconnect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AccountCard({ account, onDisconnect, onDelete }: AccountCardProps) {
  const config = platformConfig[account.platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: config.bg }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill={config.color}>
              <path d={config.icon} />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {account.account_name}
            </p>
            {account.account_handle && (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                @{account.account_handle}
              </p>
            )}
          </div>
        </div>
        <span
          className="badge text-[10px]"
          style={{
            background: account.is_connected ? 'var(--success-bg)' : 'var(--error-bg)',
            color: account.is_connected ? 'var(--success)' : 'var(--error)',
          }}
        >
          {account.is_connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {account.is_connected && (
          <button
            onClick={() => onDisconnect(account.id)}
            className="btn btn-ghost text-xs px-2 py-1"
            style={{ color: 'var(--warning)' }}
          >
            <Unlink size={12} /> Disconnect
          </button>
        )}
        <button
          onClick={() => onDelete(account.id)}
          className="btn btn-ghost text-xs px-2 py-1"
          style={{ color: 'var(--error)' }}
        >
          <Trash2 size={12} /> Remove
        </button>
      </div>
    </motion.div>
  );
}
