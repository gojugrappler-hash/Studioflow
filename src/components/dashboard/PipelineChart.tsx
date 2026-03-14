'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_DATA = [
  { stage: 'Lead', count: 24, value: 48000 },
  { stage: 'Contacted', count: 18, value: 36000 },
  { stage: 'Proposal', count: 12, value: 72000 },
  { stage: 'Negotiation', count: 8, value: 64000 },
  { stage: 'Closed Won', count: 6, value: 54000 },
];

export default function PipelineChart() {
  return (
    <div className="glass-card p-5 rounded-xl">
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Pipeline Breakdown</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={MOCK_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="stage" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}
            />
            <Bar dataKey="count" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
