'use client';

import { Users, DollarSign, Handshake, FileText } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import PipelineChart from '@/components/dashboard/PipelineChart';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import QuickActions from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Good morning! 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Contacts" value={247} icon={<Users size={18} />} color="var(--accent-teal)" trend={12} />
        <KPICard title="Revenue" value={28400} prefix="$" icon={<DollarSign size={18} />} color="var(--accent-indigo)" trend={8} />
        <KPICard title="Active Deals" value={18} icon={<Handshake size={18} />} color="var(--accent-blue)" trend={-3} />
        <KPICard title="Open Invoices" value={7} icon={<FileText size={18} />} color="var(--warning)" trend={0} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <PipelineChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActivityFeed />
        <UpcomingTasks />
        <QuickActions />
      </div>
    </div>
  );
}
