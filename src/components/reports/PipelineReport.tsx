'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DATA = [
  { stage: 'Lead', current: 24, lastMonth: 20 },
  { stage: 'Contacted', current: 18, lastMonth: 22 },
  { stage: 'Proposal', current: 12, lastMonth: 10 },
  { stage: 'Negotiation', current: 8, lastMonth: 6 },
  { stage: 'Won', current: 6, lastMonth: 4 },
  { stage: 'Lost', current: 3, lastMonth: 5 },
];

export default function PipelineReport() {
  return (
    <div className="glass-card p-5 rounded-xl">
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Pipeline Analysis</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Current vs. last month deal distribution</p>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="stage" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            <Bar dataKey="current" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="Current" />
            <Bar dataKey="lastMonth" fill="#818cf8" radius={[4, 4, 0, 0]} name="Last Month" opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
