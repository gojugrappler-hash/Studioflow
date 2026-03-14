'use client';

import { useState, use } from 'react';
import { Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PortalLogin({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const studioName = orgSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a2e 100%)', padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: 'rgba(26, 26, 46, 0.8)',
        borderRadius: '16px', border: '1px solid rgba(42, 42, 64, 0.6)',
        backdropFilter: 'blur(20px)', padding: '40px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #2dd4bf, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '24px',
          }}>
            {studioName[0]}
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#e4e4ef', marginBottom: '4px' }}>{studioName}</h1>
          <p style={{ fontSize: '14px', color: '#8888a0' }}>Client Portal</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={32} style={{ color: '#2dd4bf' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#e4e4ef', marginBottom: '8px' }}>Check your email!</h2>
            <p style={{ fontSize: '14px', color: '#8888a0', lineHeight: '1.6' }}>
              We sent a magic link to <strong style={{ color: '#e4e4ef' }}>{email}</strong>. Click the link to sign in.
            </p>
            <button onClick={() => setSent(false)} style={{ marginTop: '24px', padding: '10px 24px', background: 'none', border: '1px solid #2a2a40', borderRadius: '8px', color: '#8888a0', cursor: 'pointer', fontSize: '14px' }}>Use a different email</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#8888a0', marginBottom: '6px', display: 'block' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8888a0' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required style={{
                  width: '100%', padding: '12px 14px 12px 44px', borderRadius: '10px', border: '1px solid #2a2a40',
                  background: '#0a0a0f', color: '#e4e4ef', fontSize: '15px', outline: 'none',
                }} />
              </div>
            </div>
            <button type="submit" style={{
              width: '100%', padding: '12px', background: 'linear-gradient(135deg, #2dd4bf, #818cf8)',
              color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <Sparkles size={18} /> Send Magic Link <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#8888a0', marginTop: '16px', lineHeight: '1.5' }}>
              No password needed. We will email you a secure sign-in link.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
