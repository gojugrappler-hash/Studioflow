import { Calendar, Clock, MapPin, Plus, ChevronRight } from 'lucide-react';

export default function PortalAppointments() {
  const appointments = [
    { id: '1', title: 'Consultation — Design Review', date: 'Saturday, March 15, 2026', time: '10:00 AM - 11:00 AM', location: 'Studio A', status: 'confirmed', description: 'Initial design review for full sleeve concept' },
    { id: '2', title: 'Session 2/3 — Shading', date: 'Saturday, March 22, 2026', time: '1:00 PM - 4:00 PM', location: 'Studio A', status: 'scheduled', description: 'Continuing the back piece — shading and detail work' },
    { id: '3', title: 'Touch-up Session', date: 'Tuesday, March 4, 2026', time: '11:00 AM - 11:30 AM', location: 'Studio B', status: 'completed', description: 'Quick touch-up from previous session' },
  ];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} style={{ color: '#2dd4bf' }} /> Appointments
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary, #8888a0)', marginTop: '4px' }}>View and manage your sessions</p>
        </div>
        <button style={{
          padding: '10px 20px', background: '#2dd4bf', color: '#fff', border: 'none',
          borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Plus size={16} /> Request Appointment
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {appointments.map((apt) => (
          <div key={apt.id} style={{
            background: 'var(--bg-card, #1a1a2e)', borderRadius: '12px', border: '1px solid var(--border, #2a2a40)',
            padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: apt.status === 'completed' ? 'rgba(52, 211, 153, 0.15)' : apt.status === 'confirmed' ? 'rgba(45, 212, 191, 0.15)' : 'rgba(96, 165, 250, 0.15)',
              }}>
                <Calendar size={22} style={{ color: apt.status === 'completed' ? '#34d399' : apt.status === 'confirmed' ? '#2dd4bf' : '#60a5fa' }} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary, #e4e4ef)', marginBottom: '6px' }}>{apt.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary, #8888a0)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {apt.date} · {apt.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {apt.location}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary, #8888a0)', marginTop: '4px' }}>{apt.description}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                background: apt.status === 'completed' ? 'rgba(52, 211, 153, 0.15)' : apt.status === 'confirmed' ? 'rgba(45, 212, 191, 0.15)' : 'rgba(96, 165, 250, 0.15)',
                color: apt.status === 'completed' ? '#34d399' : apt.status === 'confirmed' ? '#2dd4bf' : '#60a5fa',
              }}>
                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
              </span>
              <ChevronRight size={18} style={{ color: 'var(--text-secondary, #8888a0)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
