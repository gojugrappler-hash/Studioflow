import { ReactNode } from 'react';

export const metadata = {
  title: 'Studioflow Admin',
  description: 'Super-admin panel',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-indigo))', color: '#0a0a0f' }}
          >
            SF
          </div>
          <span className="text-base font-semibold">Studioflow Admin</span>
        </div>
        <a href="/dashboard" className="text-xs px-3 py-1.5 rounded-lg" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          ← Back to App
        </a>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
