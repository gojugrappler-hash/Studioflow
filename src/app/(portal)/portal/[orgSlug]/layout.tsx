import { Calendar, FileText, MessageSquare, Image, Home, LogOut } from 'lucide-react';

export default async function PortalLayout({ children, params }: { children: React.ReactNode; params: Promise<{ orgSlug: string }> }) {
  const { orgSlug: slug } = await params;
  const navItems = [
    { href: '/portal/' + slug, icon: Home, label: 'Dashboard' },
    { href: '/portal/' + slug + '/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/portal/' + slug + '/invoices', icon: FileText, label: 'Invoices' },
    { href: '/portal/' + slug + '/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/portal/' + slug + '/gallery', icon: Image, label: 'Gallery' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary, #0a0a0f)' }}>
      <nav style={{
        width: '240px', background: 'var(--bg-secondary, #12121a)', borderRight: '1px solid var(--border, #2a2a40)',
        display: 'flex', flexDirection: 'column', padding: '20px 0', flexShrink: 0,
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border, #2a2a40)', marginBottom: '16px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #2dd4bf, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '18px', marginBottom: '12px',
          }}>
            {slug[0]?.toUpperCase() || 'S'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)' }}>
            {slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary, #8888a0)', marginTop: '2px' }}>Client Portal</div>
        </div>
        <div style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                borderRadius: '8px', color: 'var(--text-secondary, #8888a0)', fontSize: '14px',
                textDecoration: 'none', marginBottom: '2px', transition: 'all 0.15s',
              }}>
                <Icon size={18} /> {item.label}
              </a>
            );
          })}
        </div>
        <div style={{ padding: '0 12px' }}>
          <a href={'/portal/' + slug + '/login'} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
            borderRadius: '8px', color: 'var(--text-secondary, #8888a0)', fontSize: '14px',
            textDecoration: 'none',
          }}>
            <LogOut size={18} /> Sign Out
          </a>
        </div>
      </nav>
      <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
    </div>
  );
}
