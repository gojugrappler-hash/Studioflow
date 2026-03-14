'use client';

import { useState } from 'react';
import { Sparkles, Building2, Upload, Plug, Rocket, ChevronRight, ChevronLeft } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: WizardStep[] = [
  { id: 'welcome', title: 'Welcome to Studioflow', description: 'Let us help you set up your CRM in just a few steps.', icon: <Sparkles size={24} /> },
  { id: 'org', title: 'Your Organization', description: 'Tell us about your studio or business.', icon: <Building2 size={24} /> },
  { id: 'import', title: 'Import Data', description: 'Bring your existing contacts or start fresh.', icon: <Upload size={24} /> },
  { id: 'connect', title: 'Connect Services', description: 'Link your payment and social accounts.', icon: <Plug size={24} /> },
  { id: 'done', title: 'You are All Set!', description: 'Your CRM is ready. Start building relationships.', icon: <Rocket size={24} /> },
];

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-lg mx-4 rounded-2xl border p-8 text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        {/* Progress */}
        <div className="w-full h-1.5 rounded-full mb-8 overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: progress + '%', background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-teal))' }} />
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.2), rgba(45,212,191,0.2))' }}>
          <span style={{ color: 'var(--accent-indigo)' }}>{current.icon}</span>
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{current.title}</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>{current.description}</p>

        {/* Step-specific content */}
        {current.id === 'org' && (
          <div className="space-y-3 mb-6 text-left">
            <input type="text" placeholder="Studio / business name" className="sf-input w-full" />
            <select className="sf-input w-full">
              <option value="">Select your industry...</option>
              <option value="tattoo">Tattoo</option>
              <option value="photography">Photography</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {current.id === 'import' && (
          <div className="space-y-3 mb-6">
            <button className="w-full py-3 rounded-lg border text-sm font-medium transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <Upload size={16} className="inline mr-2" /> Import CSV
            </button>
            <button className="w-full py-3 rounded-lg border text-sm font-medium transition-colors" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              Skip for now
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm font-medium disabled:opacity-30 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}
            >
              <Rocket size={16} /> Get Started
            </button>
          )}
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mt-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: i <= step ? 'var(--accent-indigo)' : 'var(--border)', transform: i === step ? 'scale(1.3)' : 'scale(1)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
