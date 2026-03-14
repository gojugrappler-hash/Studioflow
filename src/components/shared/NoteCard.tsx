'use client';

import { motion } from 'framer-motion';
import { Pin, PinOff, Trash2, Edit } from 'lucide-react';
import type { Note } from '@/types/database';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return diffMin + 'm ago';
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + 'h ago';
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return diffDay + 'd ago';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
}

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  return (
    <motion.div
      className="glass-card p-3 group"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          {note.is_pinned && (
            <Pin size={11} style={{ color: 'var(--warning)', transform: 'rotate(45deg)' }} className="shrink-0" />
          )}
          <h5
            className="text-sm font-medium truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {note.title || 'Untitled'}
          </h5>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onTogglePin(note.id, note.is_pinned)}
            className="p-1 rounded transition-colors"
            style={{ color: note.is_pinned ? 'var(--warning)' : 'var(--text-tertiary)' }}
            aria-label={note.is_pinned ? 'Unpin note' : 'Pin note'}
          >
            {note.is_pinned ? <PinOff size={12} /> : <Pin size={12} />}
          </button>
          <button
            onClick={() => onEdit(note)}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Edit note"
          >
            <Edit size={12} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--error)' }}
            aria-label="Delete note"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {note.content && (
        <p
          className="text-xs line-clamp-3"
          style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}
        >
          {note.content}
        </p>
      )}
      <p className="text-[10px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
        {timeAgo(note.created_at)}
      </p>
    </motion.div>
  );
}
