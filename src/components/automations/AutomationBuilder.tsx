'use client';

import { useState } from 'react';
import { Plus, ArrowDown, Zap } from 'lucide-react';
import TriggerSelector from './TriggerSelector';
import ActionSelector from './ActionSelector';
import AutomationStepEditor from './AutomationStepEditor';
import type { Automation, AutomationStep, TriggerType, StepType } from '@/types/database';

interface AutomationBuilderProps {
  automation: Partial<Automation>;
  steps: AutomationStep[];
  onAutomationChange: (updates: Partial<Automation>) => void;
  onStepsChange: (steps: AutomationStep[]) => void;
  onSave: () => void;
  saving?: boolean;
}

export default function AutomationBuilder({
  automation,
  steps,
  onAutomationChange,
  onStepsChange,
  onSave,
  saving,
}: AutomationBuilderProps) {
  const [showActionPicker, setShowActionPicker] = useState(false);

  const handleTriggerSelect = (trigger: TriggerType) => {
    onAutomationChange({ trigger_type: trigger });
  };

  const handleAddStep = (stepType: StepType) => {
    const newStep: AutomationStep = {
      id: crypto.randomUUID(),
      automation_id: automation.id || '',
      org_id: '',
      step_type: stepType,
      config: {},
      position: steps.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onStepsChange([...steps, newStep]);
    setShowActionPicker(false);
  };

  const handleUpdateStep = (updated: AutomationStep) => {
    onStepsChange(steps.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteStep = (stepId: string) => {
    onStepsChange(steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, position: i })));
  };

  return (
    <div className="space-y-6">
      {/* Name & Description */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Automation name..."
          value={automation.name || ''}
          onChange={(e) => onAutomationChange({ name: e.target.value })}
          className="sf-input w-full text-lg font-semibold"
        />
        <textarea
          placeholder="Description (optional)..."
          value={automation.description || ''}
          onChange={(e) => onAutomationChange({ description: e.target.value })}
          className="sf-input w-full text-sm"
          rows={2}
        />
      </div>

      {/* IF trigger */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'var(--accent-indigo)', color: '#fff' }}>IF</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>When this happens...</span>
        </div>
        <TriggerSelector selected={automation.trigger_type || null} onSelect={handleTriggerSelect} />
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <ArrowDown size={24} style={{ color: 'var(--text-secondary)' }} />
      </div>

      {/* THEN actions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'var(--accent-teal)', color: '#fff' }}>THEN</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Do these actions...</span>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <AutomationStepEditor key={step.id} step={step} index={i} onUpdate={handleUpdateStep} onDelete={handleDeleteStep} />
          ))}
        </div>

        {showActionPicker ? (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Choose an action</span>
              <button onClick={() => setShowActionPicker(false)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
            </div>
            <ActionSelector onSelect={handleAddStep} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowActionPicker(true)}
            className="w-full mt-3 py-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:border-solid"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <Plus size={16} /> Add Action Step
          </button>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onSave}
          disabled={saving || !automation.name || !automation.trigger_type}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}
        >
          {saving ? 'Saving...' : 'Save Automation'}
        </button>
      </div>
    </div>
  );
}
