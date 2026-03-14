'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DATA = [
  { week: 'W1', calls: 12, emails: 28, meetings: 5 },
  { week: 'W2', calls: 15, emails: 32, meetings: 8 },
  { week: 'W3', calls: 10, emails: 24, meetings: 6 },
  { week: 'W4', calls: 18, emails: 35, meetings: 9 },
];

export default function ActivityReport() {
  return (
    <div className="glass-card p-5 rounded-xl">
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Activity Breakdown</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Activities by type over the last 4 weeks</p>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="week" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            <Bar dataKey="calls" fill="#60a5fa" radius={[3, 3, 0, 0]} name="Calls" />
            <Bar dataKey="emails" fill="#2dd4bf" radius={[3, 3, 0, 0]} name="Emails" />
            <Bar dataKey="meetings" fill="#a78bfa" radius={[3, 3, 0, 0]} name="Meetings" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
