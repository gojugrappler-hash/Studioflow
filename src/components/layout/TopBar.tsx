'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Search, Sun, Moon, Menu, LogOut } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { sidebarCollapsed, setCommandPaletteOpen, setSidebarOpen } = useUIStore();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    clearAuth();
    router.push('/login');
    router.refresh();
  };

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-4 md:px-6"
      style={{
        height: 'var(--topbar-height)',
        left: 0,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button className="md:hidden p-2 rounded-md" style={{ color: 'var(--text-secondary)' }} onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
        <Menu size={20} />
      </button>

      <div className="hidden md:block" style={{ width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)', transition: 'width 0.3s' }} />

      <button onClick={() => setCommandPaletteOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors flex-1 max-w-md" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>
        <Search size={16} />
        <span className="text-sm hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>Ctrl K</kbd>
      </button>

      <div className="flex items-center gap-1">
        {mounted && (
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md transition-colors" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        <NotificationDropdown />

        {/* User Menu */}
        <div className="relative ml-2">
          <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))', color: '#fff' }} aria-label="User menu">U</button>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-10 z-50 py-1 rounded-md min-w-[160px]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors" style={{ color: 'var(--error)' }}>
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
