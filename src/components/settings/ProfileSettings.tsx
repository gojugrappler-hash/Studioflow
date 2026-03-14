'use client';

import { useState } from 'react';
import { User, Save, Lock } from 'lucide-react';

export default function ProfileSettings() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <User size={18} style={{ color: 'var(--accent-teal)' }} />
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Profile</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>First Name</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="sf-input w-full" placeholder="Your first name" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="sf-input w-full" placeholder="Your last name" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="sf-input w-full" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Avatar URL</label>
          <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="sf-input w-full" placeholder="https://..." />
        </div>
      </div>

      <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Lock size={16} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Change Password</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="password" className="sf-input w-full" placeholder="Current password" />
          <input type="password" className="sf-input w-full" placeholder="New password" />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn btn-primary flex items-center gap-2"><Save size={16} /> Update Profile</button>
      </div>
    </div>
  );
}
