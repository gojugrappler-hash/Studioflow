'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ToastContainer } from '@/components/shared/Toast';
import CookieConsent from '@/components/shared/CookieConsent';
import { useUIStore } from '@/stores/uiStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <TopBar />
      <CommandPalette />
      <main
        className="transition-all duration-300 pt-[var(--topbar-height)] pb-[var(--bottomnav-height)] md:pb-0"
        style={{
          marginLeft: '0',
        }}
      >
        <div className="hidden md:block" style={{
          marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div className="p-6 animate-fade-in">
            {children}
          </div>
        </div>
        <div className="md:hidden">
          <div className="p-4 animate-fade-in">
            {children}
          </div>
        </div>
      </main>
      <BottomNav />
      <ToastContainer />
      <CookieConsent />
    </div>
  );
}
