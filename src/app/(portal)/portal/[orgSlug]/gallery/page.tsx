import { Image, Upload, Heart } from 'lucide-react';

export default function PortalGallery() {
  const images = [
    { id: '1', title: 'Phoenix Half-Sleeve - Completed', date: 'Feb 28, 2026', category: 'Completed', likes: 12 },
    { id: '2', title: 'Back Piece - Session 1 Progress', date: 'Feb 15, 2026', category: 'In Progress', likes: 8 },
    { id: '3', title: 'Design Proof - Dragon Concept', date: 'Mar 10, 2026', category: 'Reference', likes: 0 },
    { id: '4', title: 'Forearm Script - Final', date: 'Jan 20, 2026', category: 'Completed', likes: 15 },
    { id: '5', title: 'Consultation Reference - Floral', date: 'Mar 1, 2026', category: 'Reference', likes: 3 },
    { id: '6', title: 'Geometric Pattern - Session 2', date: 'Dec 10, 2025', category: 'Completed', likes: 22 },
  ];

  const categories = ['All', ...Array.from(new Set(images.map(i => i.category)))];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary, #e4e4ef)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image size={24} style={{ color: '#818cf8' }} /> Gallery
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary, #8888a0)', marginTop: '4px' }}>Your photos and reference images</p>
        </div>
        <button style={{
          padding: '10px 20px', background: '#818cf8', color: '#fff', border: 'none',
          borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Upload size={16} /> Upload Photos
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {categories.map((cat) => (
          <button key={cat} style={{
            padding: '6px 16px', borderRadius: '20px', border: '1px solid var(--border, #2a2a40)',
            background: cat === 'All' ? '#818cf8' : 'var(--bg-card, #1a1a2e)',
            color: cat === 'All' ? '#fff' : 'var(--text-secondary, #8888a0)',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
          }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {images.map((img) => (
          <div key={img.id} style={{
            background: 'var(--bg-card, #1a1a2e)', borderRadius: '12px', border: '1px solid var(--border, #2a2a40)',
            overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <div style={{
              height: '200px', background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(45, 212, 191, 0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <Image size={40} style={{ color: 'var(--text-secondary, #8888a0)', opacity: 0.3 }} />
              <span style={{
                position: 'absolute', top: '8px', right: '8px', padding: '2px 8px', borderRadius: '4px',
                background: 'rgba(0,0,0,0.6)', fontSize: '11px', color: '#e4e4ef', fontWeight: 500,
              }}>
                {img.category}
              </span>
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #e4e4ef)', marginBottom: '4px' }}>{img.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary, #8888a0)' }}>{img.date}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={12} style={{ color: img.likes > 0 ? '#f87171' : 'var(--text-secondary, #8888a0)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary, #8888a0)' }}>{img.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
