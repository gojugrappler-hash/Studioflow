'use client';

import { useState } from 'react';
import { Building2, Save } from 'lucide-react';

export default function GeneralSettings() {
  const [orgName, setOrgName] = useState('My Studio');
  const [slug, setSlug] = useState('my-studio');
  const [industry, setIndustry] = useState('tattoo');
  const [timezone, setTimezone] = useState('America/Chicago');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Building2 size={18} style={{ color: 'var(--accent-indigo)' }} />
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Organization</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Organization Name</label>
          <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="sf-input w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>URL Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="sf-input w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Industry</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="sf-input w-full">
            <option value="tattoo">Tattoo</option>
            <option value="photography">Photography</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="sf-input w-full">
            <option value="America/New_York">Eastern (ET)</option>
            <option value="America/Chicago">Central (CT)</option>
            <option value="America/Denver">Mountain (MT)</option>
            <option value="America/Los_Angeles">Pacific (PT)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn btn-primary flex items-center gap-2"><Save size={16} /> Save Changes</button>
      </div>
    </div>
  );
}
