'use client';

import { useState } from 'react';
import { X, Sparkles, Mail, PenLine, TrendingUp } from 'lucide-react';
import EmailWriter from './EmailWriter';
import CaptionGenerator from './CaptionGenerator';

type AITab = 'email' | 'caption';

interface AIAssistPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistPanel({ isOpen, onClose }: AIAssistPanelProps) {
  const [activeTab, setActiveTab] = useState<AITab>('email');

  if (!isOpen) return null;

  const tabs: { id: AITab; label: string; icon: React.ReactNode }[] = [
    { id: 'email', label: 'Email Writer', icon: <Mail size={16} /> },
    { id: 'caption', label: 'Captions', icon: <PenLine size={16} /> },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col shadow-2xl"
        style={{ background: 'var(--bg-primary)', borderLeft: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>AI Assist</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }} aria-label="Close AI panel">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2" style={{ borderBottom: '1px solid var(--border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center"
              style={{
                background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'email' && <EmailWriter />}
          {activeTab === 'caption' && <CaptionGenerator />}
        </div>
      </div>
    </>
  );
}
