'use client';

import { useState, useCallback } from 'react';
import { X, Calendar, Clock, MapPin, User, FileText } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '@/types/database';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apt: Partial<Appointment>) => void;
  appointment?: Appointment | null;
  defaultDate?: Date;
}

export default function AppointmentForm({ isOpen, onClose, onSave, appointment, defaultDate }: AppointmentFormProps) {
  const [title, setTitle] = useState(appointment?.title || '');
  const [description, setDescription] = useState(appointment?.description || '');
  const [date, setDate] = useState(() => {
    const d = appointment ? new Date(appointment.start_time) : (defaultDate || new Date());
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState(() => {
    if (appointment) return new Date(appointment.start_time).toTimeString().slice(0, 5);
    if (defaultDate) return defaultDate.toTimeString().slice(0, 5);
    return '10:00';
  });
  const [endTime, setEndTime] = useState(() => {
    if (appointment) return new Date(appointment.end_time).toTimeString().slice(0, 5);
    return '11:00';
  });
  const [location, setLocation] = useState(appointment?.location || '');
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status || 'scheduled');
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!title || !date || !startTime || !endTime) return;
    setSaving(true);
    try {
      onSave({
        ...appointment,
        title,
        description: description || null,
        start_time: new Date(`${date}T${startTime}`).toISOString(),
        end_time: new Date(`${date}T${endTime}`).toISOString(),
        location: location || null,
        status,
      });
      onClose();
    } catch (err) { console.error(err); }
    setSaving(false);
  }, [title, description, date, startTime, endTime, location, status, appointment, onSave, onClose]);

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px',
    display: 'flex', alignItems: 'center', gap: '6px',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '480px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'fadeIn 0.2s ease',
      }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--accent-teal)' }} />
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}><FileText size={14} /> Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Consultation, Session, etc." style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}><Calendar size={14} /> Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}><Clock size={14} /> Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}><Clock size={14} /> End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}><MapPin size={14} /> Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Studio address, virtual, etc." style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}><FileText size={14} /> Notes</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional details..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{
            padding: '8px 20px', background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
          }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !title} style={{
            padding: '8px 20px', background: 'var(--accent-teal)', color: '#fff', border: 'none',
            borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
            opacity: !title ? 0.5 : 1,
          }}>
            {saving ? 'Saving...' : (appointment ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}
