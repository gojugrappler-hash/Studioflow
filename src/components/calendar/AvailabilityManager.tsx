'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Save, RotateCcw } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';
import type { DayOfWeek } from '@/types/database';

const DAYS_ORDERED: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

interface DayConfig {
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

const DEFAULT_CONFIG: Record<DayOfWeek, DayConfig> = {
  monday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
  tuesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
  wednesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
  thursday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
  friday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
  saturday: { isAvailable: false, startTime: '10:00', endTime: '14:00' },
  sunday: { isAvailable: false, startTime: '10:00', endTime: '14:00' },
};

export default function AvailabilityManager() {
  const [config, setConfig] = useState<Record<DayOfWeek, DayConfig>>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const updateDay = (day: DayOfWeek, updates: Partial<DayConfig>) => {
    setConfig((prev) => ({ ...prev, [day]: { ...prev[day], ...updates } }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => setConfig(DEFAULT_CONFIG);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: 'var(--accent-teal)' }} />
            Business Hours
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Set your weekly availability for client bookings
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleReset} style={{
            padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={handleSave} style={{
            padding: '8px 16px', background: saved ? 'var(--success)' : 'var(--accent-teal)', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
          }}>
            <Save size={14} /> {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {DAYS_ORDERED.map(({ key, label }) => {
          const day = config[key];
          return (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
              background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)',
              opacity: day.isAvailable ? 1 : 0.6, transition: 'all 0.15s',
            }}>
              {/* Toggle */}
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '120px' }}>
                <div
                  onClick={() => updateDay(key, { isAvailable: !day.isAvailable })}
                  style={{
                    width: '36px', height: '20px', borderRadius: '10px', position: 'relative', cursor: 'pointer',
                    background: day.isAvailable ? 'var(--accent-teal)' : 'var(--border)',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: '2px', transition: 'left 0.2s',
                    left: day.isAvailable ? '18px' : '2px',
                  }} />
                </div>
                <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
              </label>

              {/* Time Inputs */}
              {day.isAvailable ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <input type="time" value={day.startTime} onChange={(e) => updateDay(key, { startTime: e.target.value })} style={{
                    padding: '6px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                  }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>to</span>
                  <input type="time" value={day.endTime} onChange={(e) => updateDay(key, { endTime: e.target.value })} style={{
                    padding: '6px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                  }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                    {(() => {
                      const [sh, sm] = day.startTime.split(':').map(Number);
                      const [eh, em] = day.endTime.split(':').map(Number);
                      const hours = (eh * 60 + em - sh * 60 - sm) / 60;
                      return `${hours.toFixed(1)}h`;
                    })()}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Closed</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Weekly total:{' '}
          <span style={{ fontWeight: 600, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono, monospace)' }}>
            {(() => {
              let total = 0;
              Object.values(config).forEach((d) => {
                if (d.isAvailable) {
                  const [sh, sm] = d.startTime.split(':').map(Number);
                  const [eh, em] = d.endTime.split(':').map(Number);
                  total += (eh * 60 + em - sh * 60 - sm) / 60;
                }
              });
              return `${total.toFixed(1)} hours`;
            })()}
          </span>
          {' '}across{' '}
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {Object.values(config).filter((d) => d.isAvailable).length} days
          </span>
        </div>
      </div>
    </div>
  );
}
