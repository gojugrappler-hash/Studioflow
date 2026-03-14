'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Plus, Settings, List } from 'lucide-react';
import CalendarView from '@/components/calendar/CalendarView';
import AppointmentForm from '@/components/calendar/AppointmentForm';
import AvailabilityManager from '@/components/calendar/AvailabilityManager';
import { useCalendar } from '@/hooks/useCalendar';
import type { Appointment } from '@/types/database';



export default function CalendarPage() {
  const [tab, setTab] = useState<'calendar' | 'availability'>('calendar');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { fetchAppointments, createAppointment, updateAppointment } = useCalendar();

  const loadAppointments = useCallback(async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data || []);
    } catch {
      setAppointments([]);
    }
  }, [fetchAppointments]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const handleDateClick = (date: Date) => {
    setDefaultDate(date);
    setSelectedApt(null);
    setFormOpen(true);
  };

  const handleAppointmentClick = (apt: Appointment) => {
    setSelectedApt(apt);
    setDefaultDate(undefined);
    setFormOpen(true);
  };

  const handleSave = async (apt: Partial<Appointment>) => {
    try {
      if (selectedApt) {
        await updateAppointment(selectedApt.id, apt);
      } else {
        await createAppointment(apt);
      }
      loadAppointments();
    } catch { /* empty */ }
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={24} style={{ color: 'var(--accent-teal)' }} />
            Calendar
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage appointments and availability
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Tab Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <button
              onClick={() => setTab('calendar')}
              style={{
                padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px',
                background: tab === 'calendar' ? 'var(--accent-teal)' : 'transparent',
                color: tab === 'calendar' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              <CalendarIcon size={14} /> Calendar
            </button>
            <button
              onClick={() => setTab('availability')}
              style={{
                padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px',
                background: tab === 'availability' ? 'var(--accent-teal)' : 'transparent',
                color: tab === 'availability' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              <Settings size={14} /> Availability
            </button>
          </div>
          <button
            onClick={() => { setSelectedApt(null); setDefaultDate(undefined); setFormOpen(true); }}
            style={{
              padding: '10px 20px', background: 'var(--accent-teal)', color: '#fff', border: 'none',
              borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <Plus size={16} /> New Appointment
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'calendar' ? (
          <CalendarView
            appointments={appointments}
            onDateClick={handleDateClick}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : (
          <AvailabilityManager />
        )}
      </div>

      {/* Appointment Form Modal */}
      <AppointmentForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        appointment={selectedApt}
        defaultDate={defaultDate}
      />
    </div>
  );
}
