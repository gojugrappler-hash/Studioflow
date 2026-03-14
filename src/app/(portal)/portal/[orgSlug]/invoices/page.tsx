import { FileText, DollarSign, CheckCircle2 } from 'lucide-react';

export default function PortalInvoices() {
  const invoices = [
    { id: '1', number: '#1042', description: 'Full Sleeve Tattoo - Session 2', amount: 850, date: 'Mar 10, 2026', due: 'Mar 18, 2026', status: 'sent' },
    { id: '2', number: '#1038', description: 'Consultation Fee', amount: 75, date: 'Feb 28, 2026', due: 'Mar 5, 2026', status: 'paid', paidDate: 'Mar 2, 2026' },
    { id: '3', number: '#1031', description: 'Full Sleeve Tattoo - Session 1 (Deposit)', amount: 500, date: 'Feb 15, 2026', due: 'Feb 22, 2026', status: 'paid', paidDate: 'Feb 16, 2026' },
  ];

  const totalUnpaid = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={24} style={{ color: '#fbbf24' }} /> Invoices
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary, #8888a0)', marginTop: '4px' }}>View and pay your invoices</p>
      </div>

      {totalUnpaid > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(45, 212, 191, 0.05))',
          borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '20px',
          marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 500 }}>Outstanding Balance</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', fontFamily: 'var(--font-mono, monospace)' }}>
              ${totalUnpaid.toFixed(2)}
            </div>
          </div>
          <button style={{
            padding: '12px 24px', background: '#2dd4bf', color: '#fff', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <DollarSign size={16} /> Pay All Outstanding
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {invoices.map((inv) => (
          <div key={inv.id} style={{
            background: 'var(--bg-card, #1a1a2e)', borderRadius: '12px', border: '1px solid var(--border, #2a2a40)',
            padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: inv.status === 'paid' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
              }}>
                {inv.status === 'paid' ? <CheckCircle2 size={20} style={{ color: '#34d399' }} /> : <FileText size={20} style={{ color: '#fbbf24' }} />}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #e4e4ef)' }}>
                  Invoice {inv.number}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary, #8888a0)' }}>{inv.description}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #8888a0)', marginTop: '2px' }}>
                  Issued {inv.date} {inv.status === 'paid' ? '- Paid ' + (inv.paidDate || '') : '- Due ' + inv.due}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', fontFamily: 'var(--font-mono, monospace)' }}>
                ${inv.amount.toFixed(2)}
              </span>
              {inv.status === 'paid' ? (
                <span style={{ padding: '4px 12px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontSize: '12px', fontWeight: 600 }}>Paid</span>
              ) : (
                <button style={{ padding: '8px 18px', background: '#2dd4bf', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Pay Now</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
