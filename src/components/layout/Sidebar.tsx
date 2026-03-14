'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Building2, Handshake, KanbanSquare,
  CheckSquare, Calendar, Mail, Share2, Megaphone, FileText,
  BarChart3, Zap, Settings, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', href: '/contacts', icon: Users },
  { label: 'Companies', href: '/companies', icon: Building2 },
  { label: 'Deals', href: '/deals', icon: Handshake },
  { label: 'Pipeline', href: '/pipeline', icon: KanbanSquare },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Email', href: '/email', icon: Mail },
  { label: 'Social', href: '/social', icon: Share2 },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { label: 'Invoices', href: '/invoices', icon: FileText },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Automations', href: '/automations', icon: Zap },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300"
        style={{
          width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 shrink-0"
          style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}
          >
            S
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-semibold text-base"
              style={{ color: 'var(--text-primary)' }}
            >
              Studioflow
            </motion.span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md mb-0.5 transition-all duration-150 group relative"
                style={{
                  color: isActive ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--info-bg)' : 'transparent',
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center p-3 mx-2 mb-3 rounded-md transition-colors duration-150"
          style={{ color: 'var(--text-tertiary)', background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!sidebarCollapsed && <span className="text-sm ml-2">Collapse</span>}
        </button>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-[280px] z-50 flex flex-col md:hidden"
              style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between px-4" style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}>S</div>
                  <span className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Studioflow</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }} aria-label="Close navigation">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-2 px-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md mb-0.5 transition-colors"
                      style={{ color: isActive ? 'var(--accent-indigo)' : 'var(--text-secondary)', background: isActive ? 'var(--info-bg)' : 'transparent' }}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon size={20} className="shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
