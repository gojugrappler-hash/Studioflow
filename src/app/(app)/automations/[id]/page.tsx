'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, History } from 'lucide-react';
import AutomationBuilder from '@/components/automations/AutomationBuilder';
import AutomationLogTable from '@/components/automations/AutomationLogTable';
import { useAutomations } from '@/hooks/useAutomations';
import type { Automation, AutomationStep, AutomationLog } from '@/types/database';

export default function AutomationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { fetchAutomation, updateAutomation, fetchSteps, upsertStep, deleteStep, fetchLogs } = useAutomations();

  const [automation, setAutomation] = useState<Automation | null>(null);
  const [steps, setSteps] = useState<AutomationStep[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'logs'>('builder');

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [auto, stepsData, logsData] = await Promise.all([
        fetchAutomation(id),
        fetchSteps(id),
        fetchLogs(id),
      ]);
      setAutomation(auto);
      setSteps(stepsData);
      setLogs(logsData);
    } catch (err) {
      console.error('Load error:', err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!automation) return;
    setSaving(true);
    try {
      await updateAutomation(id, {
        name: automation.name,
        description: automation.description,
        trigger_type: automation.trigger_type,
        trigger_config: automation.trigger_config,
      });
      for (const step of steps) {
        await upsertStep({ ...step, automation_id: id });
      }
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 rounded w-48" style={{ background: 'var(--bg-card)' }} />
          <div className="h-64 rounded-xl" style={{ background: 'var(--bg-card)' }} />
        </div>
      </div>
    );
  }

  if (!automation) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
        Automation not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/automations')}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
          aria-label="Back to automations"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {automation.name || 'Untitled Automation'}
        </h1>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: automation.is_active ? 'rgba(45,212,191,0.15)' : 'rgba(136,136,160,0.1)',
            color: automation.is_active ? 'var(--accent-teal)' : 'var(--text-secondary)',
          }}
        >
          {automation.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: 'var(--bg-secondary)' }}>
        <button
          onClick={() => setActiveTab('builder')}
          className="px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all"
          style={{
            background: activeTab === 'builder' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'builder' ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          <Save size={12} /> Builder
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className="px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all"
          style={{
            background: activeTab === 'logs' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'logs' ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          <History size={12} /> Logs ({logs.length})
        </button>
      </div>

      {activeTab === 'builder' ? (
        <div className="rounded-xl border p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <AutomationBuilder
            automation={automation}
            steps={steps}
            onAutomationChange={(u) => setAutomation((prev) => prev ? { ...prev, ...u } : prev)}
            onStepsChange={setSteps}
            onSave={handleSave}
            saving={saving}
          />
        </div>
      ) : (
        <div className="rounded-xl border p-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <AutomationLogTable logs={logs} />
        </div>
      )}
    </div>
  );
}
