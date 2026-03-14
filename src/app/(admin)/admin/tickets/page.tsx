'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowLeft, TicketCheck } from 'lucide-react';

interface Ticket {
  id: string;
  org_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  admin_notes: string | null;
  created_at: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.from('support_tickets').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setTickets(data || []); setLoading(false); });
  }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from('support_tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  }

  if (loading) return <div className="py-20 text-center" style={{ color: 'var(--text-secondary)' }}>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/admin" className="p-2 rounded-lg" style={{ border: '1px solid var(--border)' }}>
          <ArrowLeft size={16} />
        </a>
        <div>
          <h1 className="text-xl font-bold">Support Tickets</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{tickets.length} total tickets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ticket list */}
        <div className="space-y-2">
          {tickets.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className="w-full text-left p-4 rounded-xl transition-colors"
              style={{
                background: selected?.id === t.id ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: `1px solid ${selected?.id === t.id ? 'var(--accent-teal)' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(t.created_at).toLocaleDateString()} · {t.priority}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium shrink-0" style={{
                  background: t.status === 'open' ? 'rgba(251, 191, 36, 0.1)' : t.status === 'resolved' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(129, 140, 248, 0.1)',
                  color: t.status === 'open' ? 'var(--warning)' : t.status === 'resolved' ? 'var(--success)' : 'var(--accent-indigo)',
                }}>{t.status}</span>
              </div>
            </button>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-12">
              <TicketCheck size={32} style={{ color: 'var(--text-secondary)', margin: '0 auto 8px' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No tickets yet</p>
            </div>
          )}
        </div>

        {/* Ticket detail */}
        {selected && (
          <div className="p-6 rounded-xl space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="text-base font-semibold">{selected.subject}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{selected.description}</p>
            <div className="flex gap-2 pt-2">
              {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: selected.status === s ? 'var(--accent-teal)' : 'transparent',
                    color: selected.status === s ? '#0a0a0f' : 'var(--text-secondary)',
                    border: `1px solid ${selected.status === s ? 'var(--accent-teal)' : 'var(--border)'}`,
                  }}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
