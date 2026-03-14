'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Users, Building2, Handshake, KanbanSquare, CheckSquare, Calendar, Mail, Share2, Megaphone, FileText, BarChart3, Zap, Settings } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

const commands = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
  { label: 'Contacts', href: '/contacts', icon: Users, category: 'Navigation' },
  { label: 'Companies', href: '/companies', icon: Building2, category: 'Navigation' },
  { label: 'Deals', href: '/deals', icon: Handshake, category: 'Navigation' },
  { label: 'Pipeline', href: '/pipeline', icon: KanbanSquare, category: 'Navigation' },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare, category: 'Navigation' },
  { label: 'Calendar', href: '/calendar', icon: Calendar, category: 'Navigation' },
  { label: 'Email', href: '/email', icon: Mail, category: 'Navigation' },
  { label: 'Social', href: '/social', icon: Share2, category: 'Navigation' },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone, category: 'Navigation' },
  { label: 'Invoices', href: '/invoices', icon: FileText, category: 'Navigation' },
  { label: 'Reports', href: '/reports', icon: BarChart3, category: 'Navigation' },
  { label: 'Automations', href: '/automations', icon: Zap, category: 'Navigation' },
  { label: 'Settings', href: '/settings', icon: Settings, category: 'Navigation' },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setCommandPaletteOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        router.push(filtered[selectedIndex].href);
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [commandPaletteOpen, filtered, selectedIndex, router, setCommandPaletteOpen]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg rounded-xl overflow-hidden"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: 'var(--text-primary)', padding: 0 }}
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>ESC</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center py-8 text-sm" style={{ color: 'var(--text-tertiary)' }}>No results found</p>
              ) : (
                filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.href}
                      onClick={() => { router.push(cmd.href); setCommandPaletteOpen(false); }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm transition-colors"
                      style={{
                        color: i === selectedIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: i === selectedIndex ? 'var(--bg-card)' : 'transparent',
                      }}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="font-medium">{cmd.label}</span>
                      <span className="ml-auto text-xs" style={{ color: 'var(--text-tertiary)' }}>{cmd.category}</span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
