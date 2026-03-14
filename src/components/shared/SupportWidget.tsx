'use client';

import { useState } from 'react';
import { HelpCircle, X, Send } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSending(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('user_id', user.id)
        .single();

      await supabase.from('support_tickets').insert({
        org_id: profile?.org_id,
        user_id: user.id,
        subject: subject.trim(),
        description: description.trim(),
      });

      setSent(true);
      setTimeout(() => { setOpen(false); setSent(false); setSubject(''); setDescription(''); }, 2000);
    } catch (err) {
      console.error('Support ticket error:', err);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-indigo))',
          display: open ? 'none' : 'flex',
        }}
        aria-label="Get help"
      >
        <HelpCircle size={20} color="#0a0a0f" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Need Help?</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <p className="text-lg font-semibold" style={{ color: 'var(--success)' }}>Ticket Submitted! ✅</p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                  <input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="What do you need help with?"
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Tell us more about the issue..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-indigo))',
                    color: '#0a0a0f',
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  <Send size={14} />
                  {sending ? 'Sending...' : 'Submit Ticket'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
