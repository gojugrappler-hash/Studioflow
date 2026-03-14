'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SocialPost, SocialPlatform } from '@/types/database';
import { platformConfig } from './PlatformBadge';

interface ContentCalendarProps {
  posts: SocialPost[];
  onDayClick: (date: string) => void;
}

export function ContentCalendar({ posts, onDayClick }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const postsByDay = useMemo(() => {
    const map: Record<string, SocialPost[]> = {};
    posts.forEach((post) => {
      const date = post.scheduled_for || post.created_at;
      const day = new Date(date).toISOString().slice(0, 10);
      if (!map[day]) map[day] = [];
      map[day].push(post);
    });
    return map;
  }, [posts]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date().toISOString().slice(0, 10);

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{monthName}</h3>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="btn btn-ghost p-1"><ChevronLeft size={18} /></button>
          <button onClick={nextMonth} className="btn btn-ghost p-1"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-[10px] font-medium py-1" style={{ color: 'var(--text-tertiary)' }}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) return <div key={'empty-' + idx} />;
          const dateStr = new Date(year, month, day).toISOString().slice(0, 10);
          const dayPosts = postsByDay[dateStr] || [];
          const isToday = dateStr === today;

          return (
            <motion.button
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              className="relative p-1 rounded-lg text-center min-h-[56px] transition-colors"
              style={{
                background: isToday ? 'rgba(129, 140, 248, 0.08)' : 'transparent',
                border: isToday ? '1px solid var(--accent-indigo)' : '1px solid transparent',
              }}
              whileHover={{ background: 'var(--bg-card-hover)' }}
            >
              <span className="text-xs block mb-0.5" style={{ color: isToday ? 'var(--accent-indigo)' : 'var(--text-primary)', fontWeight: isToday ? 600 : 400 }}>
                {day}
              </span>
              {dayPosts.length > 0 && (
                <div className="flex justify-center gap-0.5 flex-wrap">
                  {dayPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: post.platform ? platformConfig[post.platform].color : 'var(--accent-indigo)' }}
                    />
                  ))}
                  {dayPosts.length > 3 && (
                    <span className="text-[8px]" style={{ color: 'var(--text-tertiary)' }}>+{dayPosts.length - 3}</span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
