'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Building2, Users, TicketCheck, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [orgs, setOrgs] = useState<{ id: string; name: string; slug: string; created_at: string }[]>([]);
  const [tickets, setTickets] = useState<{ id: string; subject: string; status: string; org_id: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function load() {
      const [orgRes, ticketRes] = await Promise.all([
        supabase.from('organizations').select('*').order('created_at', { ascending: false }),
        supabase.from('support_tickets').select('*').order('created_at', { ascending: false }).limit(20),
      ]);
      setOrgs(orgRes.data || []);
      setTickets(ticketRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const stats = [
    { label: 'Organizations', value: orgs.length, icon: Building2, color: 'var(--accent-teal)' },
    { label: 'Open Tickets', value: tickets.filter(t => t.status === 'open').length, icon: TicketCheck, color: 'var(--warning)' },
    { label: 'Total Tickets', value: tickets.length, icon: Activity, color: 'var(--accent-indigo)' },
  ];

  if (loading) return <div className="py-20 text-center" style={{ color: 'var(--text-secondary)' }}>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage all Studioflow organizations and support tickets.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <s.icon size={18} style={{ color: s.color }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Organizations */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Organizations</h2>
        {orgs.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--text-secondary)' }}>No organizations yet.</p>
        ) : (
          <div className="space-y-2">
            {orgs.map(org => (
              <div key={org.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-medium">{org.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>/{org.slug} · Joined {new Date(org.created_at).toLocaleDateString()}</p>
                </div>
                <Users size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Tickets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Support Tickets</h2>
          <a href="/admin/tickets" className="text-xs font-medium" style={{ color: 'var(--accent-teal)' }}>View all →</a>
        </div>
        {tickets.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--text-secondary)' }}>No tickets yet. 🎉</p>
        ) : (
          <div className="space-y-2">
            {tickets.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-medium">{t.subject}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                  background: t.status === 'open' ? 'rgba(251, 191, 36, 0.1)' : t.status === 'resolved' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(129, 140, 248, 0.1)',
                  color: t.status === 'open' ? 'var(--warning)' : t.status === 'resolved' ? 'var(--success)' : 'var(--accent-indigo)',
                }}>{t.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
