'use client';

import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2, Send, Clock } from 'lucide-react';
import type { SocialPost } from '@/types/database';
import { PlatformBadge } from './PlatformBadge';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  draft: { color: 'var(--text-tertiary)', bg: 'rgba(90, 90, 114, 0.1)', label: 'Draft' },
  scheduled: { color: 'var(--accent-blue)', bg: 'rgba(96, 165, 250, 0.1)', label: 'Scheduled' },
  published: { color: 'var(--success)', bg: 'var(--success-bg)', label: 'Published' },
  failed: { color: 'var(--error)', bg: 'var(--error-bg)', label: 'Failed' },
};

interface PostCardProps {
  post: SocialPost;
  index?: number;
  onEdit: (post: SocialPost) => void;
  onDelete: (id: string) => void;
  onPublish?: (id: string) => void;
}

export function PostCard({ post, index = 0, onEdit, onDelete, onPublish }: PostCardProps) {
  const status = statusConfig[post.status];
  const scheduledDate = post.scheduled_for
    ? new Date(post.scheduled_for).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="glass-card p-4 group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {post.platform && <PlatformBadge platform={post.platform} size="sm" showLabel={false} />}
          <span className="badge text-[10px]" style={{ background: status.bg, color: status.color }}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {post.status === 'draft' && onPublish && (
            <button onClick={() => onPublish(post.id)} className="p-1 rounded" style={{ color: 'var(--success)' }} aria-label="Publish">
              <Send size={13} />
            </button>
          )}
          <button onClick={() => onEdit(post)} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }} aria-label="Edit">
            <Edit size={13} />
          </button>
          <button onClick={() => onDelete(post.id)} className="p-1 rounded" style={{ color: 'var(--error)' }} aria-label="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <p className="text-sm mb-3 line-clamp-3" style={{ color: 'var(--text-primary)' }}>
        {post.content || 'No content yet...'}
      </p>

      {scheduledDate && (
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <Clock size={11} />
          {scheduledDate}
        </div>
      )}
    </motion.div>
  );
}
