'use client';

import { useState } from 'react';
import { Mail, Sparkles, Copy, Check } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

export default function EmailWriter() {
  const { generateEmail } = useAI();
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setLoading(true);
    try {
      const res = await generateEmail(recipientName, subject, tone, context);
      setResult(res.content);
    } catch (err) {
      setResult('Error generating email. Please check your Gemini API key configuration.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Mail size={18} style={{ color: 'var(--accent-blue)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Email Writer</h3>
      </div>

      <input type="text" placeholder="Recipient name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="sf-input w-full text-sm" />
      <input type="text" placeholder="Subject line" value={subject} onChange={(e) => setSubject(e.target.value)} className="sf-input w-full text-sm" />

      <select value={tone} onChange={(e) => setTone(e.target.value)} className="sf-input w-full text-sm">
        <option value="professional">Professional</option>
        <option value="friendly">Friendly &amp; Casual</option>
        <option value="formal">Formal</option>
        <option value="excited">Excited</option>
        <option value="apologetic">Apologetic</option>
      </select>

      <textarea
        placeholder="What should this email be about? e.g., Follow up on tattoo consultation, confirm appointment details..."
        value={context}
        onChange={(e) => setContext(e.target.value)}
        className="sf-input w-full text-sm"
        rows={3}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !context.trim()}
        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-blue))' }}
      >
        <Sparkles size={16} />
        {loading ? 'Generating...' : 'Generate Email'}
      </button>

      {result && (
        <div className="relative rounded-lg p-4 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded transition-colors" style={{ color: 'var(--text-secondary)' }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <pre className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)', fontFamily: 'inherit' }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
