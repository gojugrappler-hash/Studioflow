'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '@/types/database';

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: 'var(--accent-blue)',
  confirmed: 'var(--accent-teal)',
  cancelled: 'var(--error)',
  completed: 'var(--success)',
  no_show: 'var(--warning)',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarViewProps {
  appointments: Appointment[];
  onDateClick: (date: Date) => void;
  onAppointmentClick: (apt: Appointment) => void;
}

export default function CalendarView({ appointments, onDateClick, onAppointmentClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + dir);
    else if (view === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  // Build month grid
  const monthDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  }, [year, month]);

  // Week view days
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      return aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate();
    });
  };

  const isToday = (date: Date) => {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
  };

  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Controls */}
      <div style={{
        padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => navigate(1)} style={{ padding: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
            <ChevronRight size={18} />
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {view === 'day'
              ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
              : `${MONTHS[month]} ${year}`}
          </h2>
          <button onClick={goToday} style={{
            padding: '4px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '6px', cursor: 'pointer', color: 'var(--accent-teal)', fontSize: '13px', fontWeight: 500,
          }}>
            Today
          </button>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {(['month', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 16px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                background: view === v ? 'var(--accent-indigo)' : 'transparent',
                color: view === v ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Body */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {view === 'month' && (
          <div style={{ padding: '8px' }}>
            {/* Day Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '4px' }}>
              {DAYS.map((d) => (
                <div key={d} style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {d}
                </div>
              ))}
            </div>
            {/* Day Cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
              {monthDays.map(({ date, isCurrentMonth }, i) => {
                const dayApts = getAppointmentsForDate(date);
                const today = isToday(date);
                return (
                  <div
                    key={i}
                    onClick={() => onDateClick(date)}
                    style={{
                      minHeight: '100px', padding: '6px', cursor: 'pointer',
                      background: today ? 'rgba(45, 212, 191, 0.05)' : 'var(--bg-secondary)',
                      borderRadius: '6px', border: today ? '1px solid var(--accent-teal)' : '1px solid transparent',
                      opacity: isCurrentMonth ? 1 : 0.4,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = today ? 'rgba(45, 212, 191, 0.05)' : 'var(--bg-secondary)'; }}
                  >
                    <div style={{
                      fontSize: '13px', fontWeight: today ? 700 : 400,
                      color: today ? 'var(--accent-teal)' : 'var(--text-primary)',
                      marginBottom: '4px',
                    }}>
                      {date.getDate()}
                    </div>
                    {dayApts.slice(0, 3).map((apt) => (
                      <div
                        key={apt.id}
                        onClick={(e) => { e.stopPropagation(); onAppointmentClick(apt); }}
                        style={{
                          padding: '2px 6px', marginBottom: '2px', borderRadius: '4px', fontSize: '11px',
                          fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          background: `${STATUS_COLORS[apt.status]}22`,
                          color: STATUS_COLORS[apt.status],
                          borderLeft: `2px solid ${STATUS_COLORS[apt.status]}`,
                        }}
                      >
                        {formatTime(apt.start_time)} {apt.title}
                      </div>
                    ))}
                    {dayApts.length > 3 && (
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '2px 6px' }}>
                        +{dayApts.length - 3} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'week' && (
          <div style={{ display: 'flex', flex: 1 }}>
            {/* Time gutter */}
            <div style={{ width: '60px', flexShrink: 0, borderRight: '1px solid var(--border)' }}>
              {hours.map((h) => (
                <div key={h} style={{ height: '60px', padding: '4px 8px', fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'right' }}>
                  {h > 12 ? h - 12 : h}{h >= 12 ? 'PM' : 'AM'}
                </div>
              ))}
            </div>
            {/* Day columns */}
            {weekDays.map((date, i) => {
              const dayApts = getAppointmentsForDate(date);
              const today = isToday(date);
              return (
                <div key={i} style={{ flex: 1, borderRight: '1px solid var(--border)', position: 'relative' }}>
                  <div style={{
                    padding: '8px', textAlign: 'center', borderBottom: '1px solid var(--border)',
                    background: today ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{DAYS[date.getDay()]}</div>
                    <div style={{ fontSize: '18px', fontWeight: today ? 700 : 400, color: today ? 'var(--accent-teal)' : 'var(--text-primary)' }}>{date.getDate()}</div>
                  </div>
                  {hours.map((h) => (
                    <div key={h} onClick={() => { const d = new Date(date); d.setHours(h); onDateClick(d); }} style={{ height: '60px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    />
                  ))}
                  {dayApts.map((apt) => {
                    const start = new Date(apt.start_time);
                    const end = new Date(apt.end_time);
                    const top = (start.getHours() - 7) * 60 + start.getMinutes() + 40;
                    const height = Math.max(((end.getTime() - start.getTime()) / 60000), 30);
                    return (
                      <div key={apt.id} onClick={() => onAppointmentClick(apt)} style={{
                        position: 'absolute', top: `${top}px`, left: '4px', right: '4px', height: `${height}px`,
                        background: `${STATUS_COLORS[apt.status]}22`, borderLeft: `3px solid ${STATUS_COLORS[apt.status]}`,
                        borderRadius: '4px', padding: '4px 6px', cursor: 'pointer', overflow: 'hidden', fontSize: '11px',
                      }}>
                        <div style={{ fontWeight: 600, color: STATUS_COLORS[apt.status] }}>{apt.title}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{formatTime(apt.start_time)}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {view === 'day' && (
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60px', flexShrink: 0, borderRight: '1px solid var(--border)' }}>
              {hours.map((h) => (
                <div key={h} style={{ height: '60px', padding: '4px 8px', fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'right' }}>
                  {h > 12 ? h - 12 : h}{h >= 12 ? 'PM' : 'AM'}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              {hours.map((h) => (
                <div key={h} onClick={() => { const d = new Date(currentDate); d.setHours(h); onDateClick(d); }} style={{ height: '60px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                />
              ))}
              {getAppointmentsForDate(currentDate).map((apt) => {
                const start = new Date(apt.start_time);
                const end = new Date(apt.end_time);
                const top = (start.getHours() - 7) * 60 + start.getMinutes();
                const height = Math.max(((end.getTime() - start.getTime()) / 60000), 30);
                return (
                  <div key={apt.id} onClick={() => onAppointmentClick(apt)} style={{
                    position: 'absolute', top: `${top}px`, left: '8px', right: '8px', height: `${height}px`,
                    background: `${STATUS_COLORS[apt.status]}22`, borderLeft: `3px solid ${STATUS_COLORS[apt.status]}`,
                    borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: STATUS_COLORS[apt.status] }}>{apt.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Clock size={12} /> {formatTime(apt.start_time)} - {formatTime(apt.end_time)}
                    </div>
                    {apt.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <MapPin size={12} /> {apt.location}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
