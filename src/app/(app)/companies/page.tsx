'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Building2, Globe, Phone, MoreHorizontal, Trash2, Edit, X } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useAuth } from '@/hooks/useAuth';
import type { Company } from '@/types/database';

function CompanyForm({ company, open, onClose, onSave }: { company?: Company | null; open: boolean; onClose: () => void; onSave: (data: Partial<Company>) => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: company?.name || '',
    industry: company?.industry || '',
    website: company?.website || '',
    phone: company?.phone || '',
    email: company?.email || '',
    city: company?.city || '',
    state: company?.state || '',
    notes: company?.notes || '',
  });
  const update = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await onSave(form); onClose(); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
          <motion.div initial={{ opacity: 0, x: 400 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 400 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed right-0 top-0 h-screen w-full max-w-md z-50 overflow-y-auto" style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{company ? 'Edit Company' : 'New Company'}</h3>
              <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-tertiary)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Company Name *</label><input value={form.name} onChange={e => update('name', e.target.value)} required placeholder="Studio Name" /></div>
              <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Industry</label><input value={form.industry} onChange={e => update('industry', e.target.value)} placeholder="e.g. Tattoo Studio, Photography" /></div>
              <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Website</label><input value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Phone</label><input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="Phone" /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label><input value={form.email} onChange={e => update('email', e.target.value)} placeholder="Email" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>City</label><input value={form.city} onChange={e => update('city', e.target.value)} placeholder="City" /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>State</label><input value={form.state} onChange={e => update('state', e.target.value)} placeholder="State" /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label><textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Notes..." /></div>
              <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
                <motion.button type="submit" disabled={loading} className="btn btn-primary flex-1" whileTap={{ scale: 0.98 }}>{loading ? 'Saving...' : company ? 'Update' : 'Create'}</motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CompaniesPage() {
  const { orgId, loading: authLoading } = useAuth();
  const { fetchCompanies, createCompany, updateCompany, deleteCompany } = useCompanies();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orgId) return; setLoading(true);
    try { const data = await fetchCompanies(search || undefined); setCompanies(data); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [orgId, search, fetchCompanies]);

  useEffect(() => { if (orgId) load(); }, [orgId, load]);
  useEffect(() => { const t = setTimeout(() => { if (orgId) load(); }, 300); return () => clearTimeout(t); }, [search]);

  if (authLoading) return <div className="space-y-4"><div className="animate-shimmer h-10 w-64 rounded-md" /><div className="animate-shimmer h-12 w-full rounded-md" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Companies</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{companies.length} companies</p>
        </div>
        <motion.button onClick={() => { setEditCompany(null); setFormOpen(true); }} className="btn btn-primary" whileTap={{ scale: 0.97 }}><Plus size={16} /> Add Company</motion.button>
      </div>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies..." className="pl-9" style={{ maxWidth: '400px' }} />
      </div>
      {loading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="animate-shimmer h-16 w-full rounded-md" />)}</div>
      : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--info-bg)' }}><Building2 size={32} style={{ color: 'var(--accent-indigo)' }} /></div>
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No companies yet</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Add your first company</p>
          <button onClick={() => { setEditCompany(null); setFormOpen(true); }} className="btn btn-primary"><Plus size={16} /> Add Company</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_80px] gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border)' }}>
            <span>Company</span><span className="hidden md:block">Website</span><span className="hidden md:block">Phone</span><span></span>
          </div>
          <AnimatePresence>
            {companies.map((c, idx) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                className="grid grid-cols-[1fr_1fr_1fr_80px] gap-4 px-4 py-3 items-center cursor-pointer transition-colors"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                onClick={() => { setEditCompany(c); setFormOpen(true); }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: 'var(--info-bg)', color: 'var(--accent-indigo)' }}>{c.name?.[0]?.toUpperCase()}</div>
                  <div><p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</p>{c.industry && <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{c.industry}</p>}</div>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.website && <><Globe size={13} /><span className="truncate">{c.website}</span></>}</div>
                <div className="hidden md:flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.phone && <><Phone size={13} /><span>{c.phone}</span></>}</div>
                <div className="flex justify-end relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)} className="p-1.5 rounded" style={{ color: 'var(--text-tertiary)' }}><MoreHorizontal size={16} /></button>
                  {menuOpen === c.id && (
                    <div className="absolute right-0 top-8 z-20 py-1 rounded-md min-w-[140px]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                      <button onClick={() => { setEditCompany(c); setFormOpen(true); setMenuOpen(null); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}><Edit size={14} /> Edit</button>
                      <button onClick={async () => { await deleteCompany(c.id); setMenuOpen(null); load(); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm" style={{ color: 'var(--error)' }}><Trash2 size={14} /> Delete</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <CompanyForm company={editCompany} open={formOpen} onClose={() => { setFormOpen(false); setEditCompany(null); }} onSave={async (data) => { if (editCompany) { await updateCompany(editCompany.id, data); } else { await createCompany(data); } setEditCompany(null); await load(); }} />
    </div>
  );
}
