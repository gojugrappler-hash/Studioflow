'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    if (typeof window !== 'undefined' && localStorage.getItem('sf-install-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after a delay so it doesn't interfere with initial load
      setTimeout(() => setShow(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('sf-install-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px',
      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 2000, maxWidth: '420px',
      animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <style>{'@keyframes slideUp { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }'}</style>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-indigo))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Smartphone size={20} style={{ color: '#fff' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>
          Install Studioflow
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Add to your home screen for quick access
        </div>
      </div>
      <button onClick={handleInstall} style={{
        padding: '8px 16px', background: 'var(--accent-teal)', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
      }}>
        <Download size={14} /> Install
      </button>
      <button onClick={handleDismiss} style={{
        padding: '4px', background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-secondary)',
      }}>
        <X size={16} />
      </button>
    </div>
  );
}
