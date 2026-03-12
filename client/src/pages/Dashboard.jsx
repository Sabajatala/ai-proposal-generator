import { useEffect, useState } from 'react';
import { getAllProposals } from '../api/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0, draft: 0, sent: 0, accepted: 0, rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProposals()
      .then(res => {
        const list = res.data.data || [];
        setStats({
          total: list.length,
          draft: list.filter(p => p.status === 'Draft').length,
          sent: list.filter(p => p.status === 'Sent').length,
          accepted: list.filter(p => p.status === 'Accepted').length,
          rejected: list.filter(p => p.status === 'Rejected').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Dashboard</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Total</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.total}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Draft</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.draft}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Sent</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.sent}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Accepted</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.accepted}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Rejected</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.rejected}</div>
        </div>
      </div>
    </div>
  );
}