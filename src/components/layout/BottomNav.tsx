'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, KanbanSquare, Users, CheckSquare, MoreHorizontal } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

const bottomNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pipeline', href: '/pipeline', icon: KanbanSquare },
  { label: 'Contacts', href: '/contacts', icon: Users },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setSidebarOpen } = useUIStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around md:hidden"
      style={{
        height: 'var(--bottomnav-height)',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 py-1 px-3 transition-colors"
            style={{ color: isActive ? 'var(--accent-indigo)' : 'var(--text-tertiary)' }}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex flex-col items-center gap-0.5 py-1 px-3 transition-colors"
        style={{ color: 'var(--text-tertiary)' }}
        aria-label="More options"
      >
        <MoreHorizontal size={22} />
        <span className="text-[10px] font-medium">More</span>
      </button>
    </nav>
  );
}
