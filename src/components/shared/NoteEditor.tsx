'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import type { Note } from '@/types/database';

interface NoteEditorProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string }) => Promise<void>;
}

export function NoteEditor({ note, open, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ title: title.trim(), content: content.trim() });
      onClose();
    } catch (err) {
      console.error('Save note error:', err);
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
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md z-50 flex flex-col"
            style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}
          >
            <div
              className="flex items-center justify-between px-4 shrink-0"
              style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--border)' }}
            >
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {note ? 'Edit Note' : 'New Note'}
              </h3>
              <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto p-4 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" autoFocus />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note..."
                  className="flex-1 resize-none"
                  style={{ minHeight: '200px' }}
                />
              </div>
              <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
                <motion.button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary flex-1"
                  whileTap={{ scale: 0.97 }}
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
