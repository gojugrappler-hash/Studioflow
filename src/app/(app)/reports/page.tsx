'use client';

import { useState } from 'react';
import { BarChart3, DollarSign, Handshake, Activity, Users } from 'lucide-react';
import ReportCard from '@/components/reports/ReportCard';
import SalesReport from '@/components/reports/SalesReport';
import PipelineReport from '@/components/reports/PipelineReport';
import ActivityReport from '@/components/reports/ActivityReport';

type ActiveReport = 'sales' | 'pipeline' | 'activity' | null;

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ActiveReport>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <BarChart3 size={24} style={{ color: 'var(--accent-indigo)' }} />
          Reports
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Insights and analytics to grow your business
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard title="Sales Performance" description="Revenue, invoices, and payment trends" icon={<DollarSign size={20} />} color="var(--accent-teal)" onClick={() => setActiveReport(activeReport === 'sales' ? null : 'sales')} />
        <ReportCard title="Pipeline Analysis" description="Deal flow and conversion rates" icon={<Handshake size={20} />} color="var(--accent-indigo)" onClick={() => setActiveReport(activeReport === 'pipeline' ? null : 'pipeline')} />
        <ReportCard title="Activity Breakdown" description="Team activities by type and volume" icon={<Activity size={20} />} color="var(--accent-blue)" onClick={() => setActiveReport(activeReport === 'activity' ? null : 'activity')} />
        <ReportCard title="Contact Growth" description="New contacts and lead sources (coming soon)" icon={<Users size={20} />} color="var(--accent-purple)" onClick={() => {}} />
      </div>

      {/* Active Report */}
      {activeReport === 'sales' && <SalesReport />}
      {activeReport === 'pipeline' && <PipelineReport />}
      {activeReport === 'activity' && <ActivityReport />}
    </div>
  );
}
