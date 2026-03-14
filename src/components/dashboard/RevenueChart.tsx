'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_DATA = [
  { month: 'Jan', revenue: 4200 }, { month: 'Feb', revenue: 5800 }, { month: 'Mar', revenue: 4900 },
  { month: 'Apr', revenue: 7200 }, { month: 'May', revenue: 6500 }, { month: 'Jun', revenue: 8100 },
  { month: 'Jul', revenue: 7400 }, { month: 'Aug', revenue: 9200 }, { month: 'Sep', revenue: 8800 },
  { month: 'Oct', revenue: 10500 }, { month: 'Nov', revenue: 9800 }, { month: 'Dec', revenue: 12200 },
];

export default function RevenueChart() {
  return (
    <div className="glass-card p-5 rounded-xl">
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Revenue Overview</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={MOCK_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={2.5} fill="url(#revenueGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
