'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Campaign, CampaignType, CampaignStatus } from '@/types/database';

interface CampaignFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (campaign: Partial<Campaign>) => void;
  editing?: Campaign | null;
}

export function CampaignForm({ open, onClose, onSave, editing }: CampaignFormProps) {
  const [name, setName] = useState(editing?.name || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [type, setType] = useState<CampaignType>(editing?.type || 'email');
  const [startDate, setStartDate] = useState(editing?.start_date || '');
  const [endDate, setEndDate] = useState(editing?.end_date || '');
  const [budget, setBudget] = useState(editing?.budget?.toString() || '0');
  const [utmSource, setUtmSource] = useState(editing?.utm_source || '');
  const [utmMedium, setUtmMedium] = useState(editing?.utm_medium || '');
  const [utmCampaign, setUtmCampaign] = useState(editing?.utm_campaign || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        ...editing,
        name,
        description: description || null,
        type,
        start_date: startDate || null,
        end_date: endDate || null,
        budget: parseFloat(budget) || 0,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md overflow-y-auto animate-slide-in-right"
            style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{editing ? 'Edit Campaign' : 'New Campaign'}</h3>
                <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }}><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name" /></div>
                <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" rows={3} /></div>
                <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Type</label><select value={type} onChange={(e) => setType(e.target.value as CampaignType)}><option value="email">Email</option><option value="social">Social</option><option value="mixed">Mixed</option></select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Start Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                  <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>End Date</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
                </div>
                <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Budget ($)</label><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} min="0" step="0.01" /></div>
                <hr style={{ borderColor: 'var(--border)' }} />
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>UTM Tracking</p>
                <div><label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Source</label><input value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="e.g. newsletter" /></div>
                <div><label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Medium</label><input value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="e.g. email" /></div>
                <div><label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Campaign</label><input value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="e.g. spring-promo" /></div>
              </div>

              <div className="mt-8 flex gap-2">
                <button onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} className="btn btn-primary flex-1" disabled={saving || !name.trim()}>{editing ? 'Update' : 'Create'} Campaign</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}