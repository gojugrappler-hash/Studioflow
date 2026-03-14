'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, Users, FileText, ArrowRightLeft,
  TrendingUp, CheckSquare, MoreHorizontal, Clock
} from 'lucide-react';
import { useActivities } from '@/hooks/useActivities';
import { ActivityLogForm } from './ActivityLogForm';
import type { Activity, EntityType } from '@/types/database';

const activityIcons: Record<string, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  note: FileText,
  status_change: ArrowRightLeft,
  deal_update: TrendingUp,
  task: CheckSquare,
  other: MoreHorizontal,
};

const activityColors: Record<string, string> = {
  call: 'var(--accent-teal)',
  email: 'var(--accent-blue)',
  meeting: 'var(--accent-purple)',
  note: 'var(--accent-indigo)',
  status_change: 'var(--warning)',
  deal_update: 'var(--success)',
  task: 'var(--accent-pink)',
  other: 'var(--text-tertiary)',
};

const activityBg: Record<string, string> = {
  call: 'rgba(45, 212, 191, 0.1)',
  email: 'rgba(96, 165, 250, 0.1)',
  meeting: 'rgba(167, 139, 250, 0.1)',
  note: 'var(--info-bg)',
  status_change: 'var(--warning-bg)',
  deal_update: 'var(--success-bg)',
  task: 'rgba(244, 114, 182, 0.1)',
  other: 'rgba(90, 90, 114, 0.1)',
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return diffMin + 'm ago';
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + 'h ago';
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return diffDay + 'd ago';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface ActivityTimelineProps {
  entityType: EntityType;
  entityId: string;
}

export function ActivityTimeline({ entityType, entityId }: ActivityTimelineProps) {
  const { fetchActivities, logActivity } = useActivities();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await fetchActivities(entityType, entityId);
      setActivities(data);
    } catch (err) {
      console.error('Load activities error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [entityType, entityId]);

  const handleLogActivity = async (data: { activity_type: string; description: string }) => {
    await logActivity({
      entity_type: entityType,
      entity_id: entityId,
      ...data,
    });
    setShowForm(false);
    await loadActivities();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Activity
        </h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-ghost text-xs"
          style={{ padding: '4px 8px' }}
        >
          + Log
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ActivityLogForm onSubmit={handleLogActivity} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-shimmer h-14 w-full rounded-md" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No activity yet</p>
        </div>
      ) : (
        <div className="relative pl-6">
          {/* Vertical line */}
          <div
            className="absolute left-[11px] top-2 bottom-2 w-px"
            style={{ background: 'var(--border)' }}
          />
          <AnimatePresence>
            {activities.map((activity, idx) => {
              const Icon = activityIcons[activity.activity_type] || MoreHorizontal;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="relative flex items-start gap-3 pb-4"
                >
                  {/* Icon dot */}
                  <div
                    className="absolute -left-6 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 z-10"
                    style={{
                      background: activityBg[activity.activity_type],
                      border: '2px solid var(--bg-primary)',
                    }}
                  >
                    <Icon size={11} style={{ color: activityColors[activity.activity_type] }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="badge text-[10px]"
                        style={{
                          background: activityBg[activity.activity_type],
                          color: activityColors[activity.activity_type],
                        }}
                      >
                        {activity.activity_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                        {timeAgo(activity.created_at)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
