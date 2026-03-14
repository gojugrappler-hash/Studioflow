'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Signup failed  please try again');

      const userId = authData.user.id;
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
      const orgId = crypto.randomUUID();
      const pipelineId = crypto.randomUUID();

      // 2. Create organization (no .select()  avoids RLS SELECT issue)
      const { error: orgError } = await supabase
        .from('organizations')
        .insert({ id: orgId, name: businessName, slug, industry: 'other' });
      if (orgError) throw new Error('Failed to create workspace: ' + orgError.message);

      // 3. Create org_member (must come before profile so RLS SELECT works)
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({ org_id: orgId, user_id: userId, role: 'owner', joined_at: new Date().toISOString() });
      if (memberError) throw new Error('Failed to set up membership: ' + memberError.message);

      // 4. Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ user_id: userId, org_id: orgId, first_name: businessName, last_name: '', email, role: 'owner' });
      if (profileError) throw new Error('Failed to create profile: ' + profileError.message);

      // 5. Create default pipeline
      const { error: pipelineError } = await supabase
        .from('pipelines')
        .insert({ id: pipelineId, org_id: orgId, name: 'Sales Pipeline', is_default: true });
      if (pipelineError) console.warn('Pipeline creation failed:', pipelineError.message);

      // 6. Create default stages
      if (!pipelineError) {
        const stages = [
          { name: 'Lead', color: '#8888a0', position: 0, is_won: false, is_lost: false },
          { name: 'Qualified', color: '#60a5fa', position: 1, is_won: false, is_lost: false },
          { name: 'Proposal', color: '#818cf8', position: 2, is_won: false, is_lost: false },
          { name: 'Negotiation', color: '#fbbf24', position: 3, is_won: false, is_lost: false },
          { name: 'Closed Won', color: '#34d399', position: 4, is_won: true, is_lost: false },
          { name: 'Closed Lost', color: '#f87171', position: 5, is_won: false, is_lost: true },
        ];
        await supabase
          .from('pipeline_stages')
          .insert(stages.map(s => ({ ...s, pipeline_id: pipelineId, org_id: orgId })));
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))' }}>S</div>
        <div>
          <h1 className="text-xl font-bold gradient-text">Studioflow</h1>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>CRM for Creative Professionals</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Create your workspace</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Start managing your creative business</p>

      {error && (
        <div className="mb-4 p-3 rounded-md text-sm" style={{ background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid var(--error)' }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Business Name</label>
          <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your Studio Name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" required autoComplete="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8} autoComplete="new-password" style={{ paddingRight: '40px' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </div>
        <motion.button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5 text-sm" whileTap={{ scale: 0.98 }}>
          {loading ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating workspace...</span>) : (<span className="flex items-center gap-2">Get started <ArrowRight size={16} /></span>)}
        </motion.button>
      </form>
      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>Already have an account? <Link href="/login" className="font-medium" style={{ color: 'var(--accent-indigo)' }}>Sign in</Link></p>
    </div>
  );
}
