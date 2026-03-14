'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, Send, ImagePlus } from 'lucide-react';
import type { SocialPlatform, SocialPost } from '@/types/database';
import { PlatformBadge, platformConfig } from './PlatformBadge';

const platforms: SocialPlatform[] = ['instagram', 'facebook', 'tiktok', 'x', 'linkedin', 'pinterest'];

const charLimits: Partial<Record<SocialPlatform, number>> = {
  x: 280,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
};

interface PostComposerProps {
  open: boolean;
  onClose: () => void;
  onSave: (post: Partial<SocialPost>) => void;
  editingPost?: SocialPost | null;
}

export function PostComposer({ open, onClose, onSave, editingPost }: PostComposerProps) {
  const [platform, setPlatform] = useState<SocialPlatform>(editingPost?.platform || 'instagram');
  const [content, setContent] = useState(editingPost?.content || '');
  const [scheduledFor, setScheduledFor] = useState(editingPost?.scheduled_for?.slice(0, 16) || '');
  const [saving, setSaving] = useState(false);

  const charLimit = charLimits[platform];
  const isOverLimit = charLimit ? content.length > charLimit : false;

  const handleSave = async (asDraft: boolean) => {
    setSaving(true);
    try {
      await onSave({
        ...editingPost,
        platform,
        content,
        scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : null,
        status: asDraft ? 'draft' : 'scheduled',
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto"
            style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderRadius: '16px 16px 0 0' }}
          >
            <div className="p-4 pb-8 max-w-2xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h3>
                <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Platform Selector */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className="transition-all"
                    style={{
                      opacity: platform === p ? 1 : 0.4,
                      transform: platform === p ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <PlatformBadge platform={p} size="md" />
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="relative mb-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={6}
                  className="w-full resize-none"
                  style={{ minHeight: '120px' }}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  {charLimit && (
                    <span className="text-[10px]" style={{ color: isOverLimit ? 'var(--error)' : 'var(--text-tertiary)' }}>
                      {content.length}/{charLimit}
                    </span>
                  )}
                </div>
              </div>

              {/* AI Caption (stub) */}
              <button
                className="btn btn-ghost text-xs mb-4"
                style={{ color: 'var(--accent-purple)' }}
                onClick={() => setContent(content + ' ?')}
              >
                <Sparkles size={14} /> AI Caption (Coming Soon)
              </button>

              {/* Schedule */}
              <div className="mb-6">
                <label className="text-xs font-medium mb-1 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={12} /> Schedule For
                </label>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => handleSave(true)} className="btn btn-secondary flex-1" disabled={saving || !content.trim()}>
                  Save Draft
                </button>
                <button onClick={() => handleSave(false)} className="btn btn-primary flex-1" disabled={saving || !content.trim() || !scheduledFor}>
                  <Send size={14} /> Schedule
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
