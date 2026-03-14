'use client';

import { useState, use } from 'react';
import { MessageSquare, Send, Paperclip } from 'lucide-react';

export default function PortalMessages({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params);
  const [newMsg, setNewMsg] = useState('');
  const studioName = orgSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const messages = [
    { id: '1', from: 'studio', name: studioName, content: 'Your design proofs are ready! Take a look and let me know if you want any changes.', time: '2:30 PM' },
    { id: '2', from: 'client', name: 'You', content: 'These look amazing! I love the shading on the phoenix. Can we make the wings slightly wider?', time: '3:15 PM' },
    { id: '3', from: 'studio', name: studioName, content: 'Absolutely! I will update the design and send you a revised proof by tomorrow.', time: '3:22 PM' },
    { id: '4', from: 'studio', name: studioName, content: 'Also, just a reminder - your session is confirmed for March 15 at 10 AM.', time: '3:25 PM' },
    { id: '5', from: 'studio', name: studioName, content: 'Thanks for your deposit! Your session is now confirmed.', time: '11:00 AM' },
    { id: '6', from: 'client', name: 'You', content: 'Just sent the deposit. Cannot wait for the session!', time: '10:45 AM' },
  ];

  const handleSend = () => { if (newMsg.trim()) setNewMsg(''); };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border, #2a2a40)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={24} style={{ color: '#818cf8' }} /> Messages
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary, #8888a0)', marginTop: '4px' }}>Chat with {studioName}</p>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[...messages].reverse().map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'client' ? 'flex-end' : 'flex-start', maxWidth: '70%', alignSelf: msg.from === 'client' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              padding: '12px 16px', borderRadius: msg.from === 'client' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              background: msg.from === 'client' ? 'linear-gradient(135deg, #2dd4bf, #818cf8)' : 'var(--bg-card, #1a1a2e)',
              color: msg.from === 'client' ? '#fff' : 'var(--text-primary, #e4e4ef)',
              border: msg.from === 'studio' ? '1px solid var(--border, #2a2a40)' : 'none',
              fontSize: '14px', lineHeight: '1.5',
            }}>
              {msg.content}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary, #8888a0)', marginTop: '4px', padding: '0 4px' }}>{msg.time}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px 32px', borderTop: '1px solid var(--border, #2a2a40)', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button style={{ padding: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary, #8888a0)' }}><Paperclip size={20} /></button>
        <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} placeholder="Type a message..." style={{
          flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border, #2a2a40)',
          background: 'var(--bg-card, #1a1a2e)', color: 'var(--text-primary, #e4e4ef)', fontSize: '14px', outline: 'none',
        }} />
        <button onClick={handleSend} style={{ padding: '10px 20px', background: '#818cf8', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600 }}>
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  );
}
