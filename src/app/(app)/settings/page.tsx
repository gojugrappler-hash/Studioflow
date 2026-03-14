'use client';

import { useState } from 'react';
import { Settings, Building2, User, Plug, Bell } from 'lucide-react';
import GeneralSettings from '@/components/settings/GeneralSettings';
import ProfileSettings from '@/components/settings/ProfileSettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

type SettingsTab = 'general' | 'profile' | 'integrations' | 'notifications';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Building2 size={16} /> },
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'integrations', label: 'Integrations', icon: <Plug size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Settings size={24} style={{ color: 'var(--accent-indigo)' }} />
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage your organization and account settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-all"
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
      <div className="rounded-xl border p-6" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        {activeTab === 'general' && <GeneralSettings />}
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'integrations' && <IntegrationSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  );
}
