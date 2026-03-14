'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const router = useRouter();
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

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
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

      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Sign in to your workspace</p>

      {error && (
        <div className="mb-4 p-3 rounded-md text-sm" style={{ background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid var(--error)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" required autoComplete="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password" style={{ paddingRight: '40px' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" style={{ width: 'auto' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm" style={{ color: 'var(--accent-indigo)' }}>Forgot password?</Link>
        </div>
        <motion.button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5 text-sm" whileTap={{ scale: 0.98 }}>
          {loading ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>) : (<span className="flex items-center gap-2">Sign in <ArrowRight size={16} /></span>)}
        </motion.button>
      </form>
      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>Don&apos;t have an account? <Link href="/signup" className="font-medium" style={{ color: 'var(--accent-indigo)' }}>Create workspace</Link></p>
    </div>
  );
}
