'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';
import type { ToastType } from '@/stores/toastStore';

const TOAST_CONFIG: Record<ToastType, { icon: React.ReactNode; bg: string; border: string; color: string }> = {
  success: { icon: <CheckCircle size={18} />, bg: 'rgba(52,211,153,0.12)', border: 'var(--success)', color: 'var(--success)' },
  error: { icon: <XCircle size={18} />, bg: 'rgba(248,113,113,0.12)', border: 'var(--error)', color: 'var(--error)' },
  warning: { icon: <AlertTriangle size={18} />, bg: 'rgba(251,191,36,0.12)', border: 'var(--warning)', color: 'var(--warning)' },
  info: { icon: <Info size={18} />, bg: 'rgba(129,140,248,0.12)', border: 'var(--info)', color: 'var(--info)' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" role="alert" aria-live="polite">
      {toasts.map((toast) => {
        const cfg = TOAST_CONFIG[toast.type];
        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-up"
            style={{
              background: cfg.bg,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${cfg.border}`,
            }}
          >
            <span className="mt-0.5 shrink-0" style={{ color: cfg.color }}>{cfg.icon}</span>
            <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 rounded transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
