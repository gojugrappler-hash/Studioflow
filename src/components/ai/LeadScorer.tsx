'use client';

import { useState } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface ScoreFactor {
  factor: string;
  impact: string;
  description: string;
}

interface ScoreResult {
  score: number;
  factors: ScoreFactor[];
  recommendation: string;
}

interface LeadScorerProps {
  contactContext: string;
}

export default function LeadScorer({ contactContext }: LeadScorerProps) {
  const { scoreLeads } = useAI();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScore = async () => {
    setLoading(true);
    try {
      const res = await scoreLeads(contactContext);
      const parsed = JSON.parse(res.content);
      setResult(parsed);
    } catch {
      setResult({ score: 0, factors: [], recommendation: 'Unable to calculate score. Check API configuration.' });
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} style={{ color: 'var(--accent-indigo)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Lead Score</h3>
        </div>
        <button
          onClick={handleScore}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
          style={{ background: 'var(--bg-card)', color: 'var(--accent-indigo)', border: '1px solid var(--border)' }}
        >
          <Sparkles size={12} />
          {loading ? 'Scoring...' : 'Calculate'}
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="text-3xl font-bold font-mono"
              style={{ color: getScoreColor(result.score) }}
            >
              {result.score}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>/ 100</div>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: result.score + '%', background: getScoreColor(result.score) }} />
            </div>
          </div>

          {result.factors.length > 0 && (
            <div className="space-y-1">
              {result.factors.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{f.factor}</span>
                  <span className="font-medium" style={{ color: f.impact === 'positive' ? 'var(--success)' : f.impact === 'negative' ? 'var(--error)' : 'var(--warning)' }}>
                    {f.impact}
                  </span>
                </div>
              ))}
            </div>
          )}

          {result.recommendation && (
            <p className="text-xs p-2 rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              {result.recommendation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
