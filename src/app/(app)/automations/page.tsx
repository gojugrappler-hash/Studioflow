'use client';

import { useState, useEffect } from 'react';
import { Zap, Plus, Sparkles, Filter } from 'lucide-react';
import AutomationCard from '@/components/automations/AutomationCard';
import AutomationBuilder from '@/components/automations/AutomationBuilder';
import AIAssistPanel from '@/components/ai/AIAssistPanel';
import { useAutomations } from '@/hooks/useAutomations';
import type { Automation, AutomationStep } from '@/types/database';

type FilterTab = 'all' | 'active' | 'inactive';

export default function AutomationsPage() {
  const { fetchAutomations, createAutomation, toggleAutomation } = useAutomations();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [saving, setSaving] = useState(false);

  // New automation state
  const [newAutomation, setNewAutomation] = useState<Partial<Automation>>({ name: '', description: '' });
  const [newSteps, setNewSteps] = useState<AutomationStep[]>([]);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    try {
      const data = await fetchAutomations();
      setAutomations(data);
    } catch (err) {
      console.error('Failed to load automations:', err);
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await toggleAutomation(id, active);
      setAutomations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_active: active } : a))
      );
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const created = await createAutomation({
        ...newAutomation,
        trigger_config: {},
      });
      setAutomations((prev) => [created, ...prev]);
      setShowBuilder(false);
      setNewAutomation({ name: '', description: '' });
      setNewSteps([]);
    } catch (err) {
      console.error('Failed to create:', err);
    }
    setSaving(false);
  };

  const handleClick = (id: string) => {
    window.location.href = '/automations/' + id;
  };

  const filtered = automations.filter((a) => {
    if (filter === 'active') return a.is_active;
    if (filter === 'inactive') return !a.is_active;
    return true;
  });

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Zap size={24} style={{ color: 'var(--accent-indigo)' }} />
            Automations
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Build no-code workflows to automate your business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAI(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
            style={{ background: 'var(--bg-card)', color: 'var(--accent-indigo)', border: '1px solid var(--border)' }}
          >
            <Sparkles size={16} /> AI Assist
          </button>
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}
          >
            <Plus size={16} /> New Automation
          </button>
        </div>
      </div>

      {/* Builder */}
      {showBuilder && (
        <div className="mb-8 rounded-xl border p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <AutomationBuilder
            automation={newAutomation}
            steps={newSteps}
            onAutomationChange={(u) => setNewAutomation((prev) => ({ ...prev, ...u }))}
            onStepsChange={setNewSteps}
            onSave={handleSave}
            saving={saving}
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className="px-4 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: filter === tab.id ? 'var(--bg-card)' : 'transparent',
              color: filter === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}
        <span className="px-2 py-1.5 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          {filtered.length}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border p-5 animate-pulse" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', height: 160 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(129,140,248,0.1)' }}>
            <Zap size={32} style={{ color: 'var(--accent-indigo)' }} />
          </div>
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No automations yet</h2>
          <p className="text-sm mb-6 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Create your first automation to streamline your workflow. Set triggers and actions to run automatically.
          </p>
          <button
            onClick={() => setShowBuilder(true)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}
          >
            <Plus size={16} /> Create Automation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AutomationCard key={a.id} automation={a} onToggle={handleToggle} onClick={handleClick} />
          ))}
        </div>
      )}

      {/* AI Panel */}
      <AIAssistPanel isOpen={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
}
