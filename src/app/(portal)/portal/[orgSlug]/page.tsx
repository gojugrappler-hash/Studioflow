import { Calendar, FileText, MessageSquare, Clock, DollarSign, Bell } from 'lucide-react';

export default async function PortalDashboard({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const studioName = orgSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const upcomingAppointments = [
    { id: '1', title: 'Consultation - Design Review', date: 'Mar 15, 2026', time: '10:00 AM', status: 'confirmed' },
    { id: '2', title: 'Session 2/3 - Shading', date: 'Mar 22, 2026', time: '1:00 PM', status: 'scheduled' },
  ];

  const pendingInvoices = [
    { id: '1', number: '#1042', amount: '$850.00', due: 'Mar 18, 2026', status: 'sent' },
  ];

  const recentMessages = [
    { id: '1', from: studioName, preview: 'Your design proofs are ready! Take a look and...', time: '2h ago' },
    { id: '2', from: studioName, preview: 'Thanks for your deposit! Your session is confirmed...', time: '1 day ago' },
  ];

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card, #1a1a2e)', borderRadius: '12px', border: '1px solid var(--border, #2a2a40)', padding: '20px',
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', marginBottom: '4px' }}>Welcome back!</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary, #8888a0)' }}>Here is what is happening with your account at {studioName}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={24} style={{ color: '#2dd4bf' }} /></div>
          <div><div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', fontFamily: 'var(--font-mono, monospace)' }}>2</div><div style={{ fontSize: '13px', color: 'var(--text-secondary, #8888a0)' }}>Upcoming Appointments</div></div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={24} style={{ color: '#fbbf24' }} /></div>
          <div><div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', fontFamily: 'var(--font-mono, monospace)' }}>$850</div><div style={{ fontSize: '13px', color: 'var(--text-secondary, #8888a0)' }}>Outstanding Balance</div></div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(129, 140, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={24} style={{ color: '#818cf8' }} /></div>
          <div><div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', fontFamily: 'var(--font-mono, monospace)' }}>1</div><div style={{ fontSize: '13px', color: 'var(--text-secondary, #8888a0)' }}>New Messages</div></div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary, #e4e4ef)', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} style={{ color: '#2dd4bf' }} /> Upcoming Appointments</h2>
            <a href={'/portal/' + orgSlug + '/appointments'} style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none' }}>View All</a>
          </div>
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} style={{ padding: '12px', background: 'var(--bg-secondary, #12121a)', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary, #e4e4ef)' }}>{apt.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #8888a0)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}><Clock size={12} /> {apt.date} at {apt.time}</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: apt.status === 'confirmed' ? 'rgba(45, 212, 191, 0.15)' : 'rgba(96, 165, 250, 0.15)', color: apt.status === 'confirmed' ? '#2dd4bf' : '#60a5fa' }}>
                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary, #e4e4ef)', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} style={{ color: '#fbbf24' }} /> Pending Invoices</h2>
              <a href={'/portal/' + orgSlug + '/invoices'} style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none' }}>View All</a>
            </div>
            {pendingInvoices.map((inv) => (
              <div key={inv.id} style={{ padding: '12px', background: 'var(--bg-secondary, #12121a)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary, #e4e4ef)' }}>Invoice {inv.number}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary, #8888a0)', marginTop: '2px' }}>Due {inv.due}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', fontFamily: 'var(--font-mono, monospace)' }}>{inv.amount}</span>
                  <button style={{ padding: '6px 14px', background: '#2dd4bf', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Pay Now</button>
                </div>
              </div>
            ))}
          </div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary, #e4e4ef)', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={18} style={{ color: '#818cf8' }} /> Messages</h2>
              <a href={'/portal/' + orgSlug + '/messages'} style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none' }}>View All</a>
            </div>
            {recentMessages.map((msg) => (
              <div key={msg.id} style={{ padding: '12px', background: 'var(--bg-secondary, #12121a)', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #e4e4ef)' }}>{msg.from}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary, #8888a0)' }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary, #8888a0)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.preview}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
