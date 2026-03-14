'use client';

import { useState } from 'react';
import { PenLine, Sparkles, Copy, Check } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', color: '#E1306C' },
  { value: 'tiktok', label: 'TikTok', color: '#00f2ea' },
  { value: 'facebook', label: 'Facebook', color: '#1877F2' },
  { value: 'x', label: 'X / Twitter', color: '#f5f5f5' },
  { value: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { value: 'pinterest', label: 'Pinterest', color: '#E60023' },
];

export default function CaptionGenerator() {
  const { generateCaption } = useAI();
  const [platform, setPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('engaging');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await generateCaption(platform, topic, tone);
      setResult(res.content);
    } catch (err) {
      setResult('Error generating caption. Please check your Gemini API key configuration.');
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
        <PenLine size={18} style={{ color: 'var(--accent-teal)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Caption Generator</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPlatform(p.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: platform === p.value ? p.color : 'var(--bg-secondary)',
              color: platform === p.value ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${platform === p.value ? p.color : 'var(--border)'}`,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <select value={tone} onChange={(e) => setTone(e.target.value)} className="sf-input w-full text-sm">
        <option value="engaging">Engaging</option>
        <option value="professional">Professional</option>
        <option value="funny">Funny / Witty</option>
        <option value="inspirational">Inspirational</option>
        <option value="educational">Educational</option>
        <option value="promotional">Promotional</option>
      </select>

      <textarea
        placeholder="Describe what the post is about... e.g., New tattoo piece completed, a detailed sleeve with Japanese motifs"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="sf-input w-full text-sm"
        rows={3}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))' }}
      >
        <Sparkles size={16} />
        {loading ? 'Generating...' : 'Generate Caption'}
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
