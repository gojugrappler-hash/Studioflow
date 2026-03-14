'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const activityTypes = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'note', label: 'Note' },
  { value: 'other', label: 'Other' },
];

interface ActivityLogFormProps {
  onSubmit: (data: { activity_type: string; description: string }) => Promise<void>;
  onCancel: () => void;
}

export function ActivityLogForm({ onSubmit, onCancel }: ActivityLogFormProps) {
  const [activityType, setActivityType] = useState('call');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ activity_type: activityType, description: description.trim() });
      setDescription('');
    } catch (err) {
      console.error('Log activity error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-card p-3 space-y-2"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          style={{ maxWidth: '120px', fontSize: '12px', padding: '6px 28px 6px 8px' }}
        >
          {activityTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What happened?"
          className="flex-1"
          style={{ fontSize: '12px', padding: '6px 8px' }}
          autoFocus
        />
        <motion.button
          type="submit"
          disabled={saving || !description.trim()}
          className="btn btn-primary"
          style={{ padding: '6px 10px', fontSize: '12px' }}
          whileTap={{ scale: 0.95 }}
        >
          <Send size={12} />
        </motion.button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          style={{ padding: '6px 8px', fontSize: '12px' }}
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}
