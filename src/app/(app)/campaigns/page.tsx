'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Megaphone, FileText } from 'lucide-react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useForms } from '@/hooks/useForms';
import type { Campaign, Form } from '@/types/database';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { FormCard } from '@/components/forms/FormCard';
import { FormBuilder } from '@/components/forms/FormBuilder';

type Tab = 'campaigns' | 'forms';

export default function CampaignsPage() {
  const [tab, setTab] = useState<Tab>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [campaignFormOpen, setCampaignFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formBuilderOpen, setFormBuilderOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  const { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } = useCampaigns();
  const { fetchForms, createForm, updateForm, deleteForm } = useForms();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, f] = await Promise.all([fetchCampaigns(), fetchForms()]);
      setCampaigns(c);
      setForms(f);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [fetchCampaigns, fetchForms]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveCampaign = async (data: Partial<Campaign>) => {
    if (editingCampaign) { await updateCampaign(editingCampaign.id, data); }
    else { await createCampaign(data); }
    setEditingCampaign(null);
    loadData();
  };
  const handleDeleteCampaign = async (id: string) => { await deleteCampaign(id); loadData(); };

  const handleSaveForm = async (data: Partial<Form>) => {
    if (editingForm) { await updateForm(editingForm.id, data); }
    else { await createForm(data); }
    setEditingForm(null);
    loadData();
  };
  const handleDeleteForm = async (id: string) => { await deleteForm(id); loadData(); };
  const handleToggleFormActive = async (id: string, active: boolean) => { await updateForm(id, { is_active: active } as Partial<Form>); loadData(); };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { key: 'forms', label: 'Forms', icon: FileText },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Campaigns</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{campaigns.length} campaigns • {forms.length} forms</p>
        </div>
        <button className="btn btn-primary" onClick={() => { if (tab === 'campaigns') { setEditingCampaign(null); setCampaignFormOpen(true); } else { setEditingForm(null); setFormBuilderOpen(true); } }}>
          <Plus size={16} /> {tab === 'campaigns' ? 'New Campaign' : 'New Form'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: 'var(--bg-card)' }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all" style={{ background: tab === t.key ? 'var(--bg-elevated)' : 'transparent', color: tab === t.key ? 'var(--text-primary)' : 'var(--text-tertiary)', boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Campaigns Tab */}
      {tab === 'campaigns' && (
        <div>
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--info-bg)' }}>
                <Megaphone size={28} style={{ color: 'var(--accent-indigo)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No campaigns yet</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>Create your first campaign to start marketing</p>
              <button className="btn btn-primary" onClick={() => setCampaignFormOpen(true)}><Plus size={14} /> Create Campaign</button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {campaigns.map((c, i) => (
                <CampaignCard key={c.id} campaign={c} index={i} onEdit={(c) => { setEditingCampaign(c); setCampaignFormOpen(true); }} onDelete={handleDeleteCampaign} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Forms Tab */}
      {tab === 'forms' && (
        <div>
          {forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--info-bg)' }}>
                <FileText size={28} style={{ color: 'var(--accent-indigo)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No forms yet</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>Build an embeddable form to capture leads</p>
              <button className="btn btn-primary" onClick={() => setFormBuilderOpen(true)}><Plus size={14} /> Build Form</button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {forms.map((f, i) => (
                <FormCard key={f.id} form={f} index={i} onEdit={(f) => { setEditingForm(f); setFormBuilderOpen(true); }} onDelete={handleDeleteForm} onToggleActive={handleToggleFormActive} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Slide-overs */}
      <CampaignForm open={campaignFormOpen} onClose={() => { setCampaignFormOpen(false); setEditingCampaign(null); }} onSave={handleSaveCampaign} editing={editingCampaign} />
      <FormBuilder open={formBuilderOpen} onClose={() => { setFormBuilderOpen(false); setEditingForm(null); }} onSave={handleSaveForm} editing={editingForm} />
    </div>
  );
}