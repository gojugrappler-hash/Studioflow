'use client';

import { Plug, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const INTEGRATIONS = [
  { name: 'Supabase', description: 'Database, auth, and real-time', status: 'connected', color: '#3ECF8E' },
  { name: 'Square', description: 'Payments and invoicing', status: 'not_configured', color: '#3E4348' },
  { name: 'Google Gemini', description: 'AI email, captions, lead scoring', status: process.env.NEXT_PUBLIC_GEMINI_KEY ? 'connected' : 'not_configured', color: '#4285F4' },
  { name: 'Resend', description: 'Transactional and campaign email', status: 'not_configured', color: '#000' },
  { name: 'Google Drive', description: 'File storage and auto-folders', status: 'not_configured', color: '#0F9D58' },
  { name: 'Tawk.to', description: 'Live chat support widget', status: 'not_configured', color: '#03C150' },
  { name: 'Sentry', description: 'Error tracking and monitoring', status: 'not_configured', color: '#362D59' },
];

export default function IntegrationSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Plug size={18} style={{ color: 'var(--accent-blue)' }} />
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Integrations</h3>
      </div>

      <div className="space-y-2">
        {INTEGRATIONS.map((int) => (
          <div key={int.name} className="flex items-center justify-between p-4 rounded-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: int.color }}>
                {int.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{int.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{int.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {int.status === 'connected' ? (
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--success)' }}>
                  <CheckCircle size={14} /> Connected
                </span>
              ) : (
                <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                  Configure <ExternalLink size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
