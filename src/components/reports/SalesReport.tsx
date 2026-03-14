'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DATA = [
  { month: 'Jan', revenue: 4200, invoiced: 5100 }, { month: 'Feb', revenue: 5800, invoiced: 6200 },
  { month: 'Mar', revenue: 4900, invoiced: 5500 }, { month: 'Apr', revenue: 7200, invoiced: 7800 },
  { month: 'May', revenue: 6500, invoiced: 7100 }, { month: 'Jun', revenue: 8100, invoiced: 8500 },
  { month: 'Jul', revenue: 7400, invoiced: 8200 }, { month: 'Aug', revenue: 9200, invoiced: 9800 },
  { month: 'Sep', revenue: 8800, invoiced: 9200 }, { month: 'Oct', revenue: 10500, invoiced: 11200 },
  { month: 'Nov', revenue: 9800, invoiced: 10500 }, { month: 'Dec', revenue: 12200, invoiced: 12800 },
];

export default function SalesReport() {
  return (
    <div className="glass-card p-5 rounded-xl">
      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Sales Performance</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Revenue collected vs. invoiced over the last 12 months</p>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            <Line type="monotone" dataKey="revenue" stroke="#2dd4bf" strokeWidth={2.5} dot={false} name="Collected" />
            <Line type="monotone" dataKey="invoiced" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Invoiced" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
