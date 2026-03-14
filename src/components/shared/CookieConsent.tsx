'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sf_cookie_consent');
    if (!consent) setShown(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sf_cookie_consent', 'accepted');
    setShown(false);
  };

  const handleDecline = () => {
    localStorage.setItem('sf_cookie_consent', 'declined');
    setShown(false);
  };

  if (!shown) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] p-4 animate-slide-up"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            We use cookies to improve your experience. By continuing, you agree to our{' '}
            <a href="/privacy" className="underline" style={{ color: 'var(--accent-indigo)' }}>Privacy Policy</a>.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={handleDecline} className="px-4 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            Decline
          </button>
          <button onClick={handleAccept} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--accent-indigo)' }}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
