'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSent(true); setLoading(false); }, 800);
  };

  if (sent) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--success-bg)' }}>
          <Mail size={24} style={{ color: 'var(--success)' }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Check your email</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>We sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong></p>
        <Link href="/login" className="btn btn-secondary w-full py-2.5 text-sm inline-flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-8">
      <Link href="/login" className="inline-flex items-center gap-1 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={14} /> Back to sign in
      </Link>
      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Reset password</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Enter your email and we will send you a reset link</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" required autoComplete="email" />
        </div>
        <motion.button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5 text-sm" whileTap={{ scale: 0.98 }}>
          {loading ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>) : 'Send reset link'}
        </motion.button>
      </form>
    </div>
  );
}
