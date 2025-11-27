import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

export default function AdminMemberships() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/admin/memberships').then(res => {
      if (Array.isArray(res)) setItems(res);
      else setError(res.message || 'Failed to load memberships');
      setLoading(false);
    }).catch(e => { setError(e.message || 'Failed to load memberships'); setLoading(false); });
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <section className="page-card">
        <PageHeader title="Forbidden" description="Admins only." />
      </section>
    );
  }
  if (loading) return <div>Loading memberships...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <section className="page-card">
      <PageHeader
        eyebrow="Admin"
        title="Club memberships"
        description="Track every membership request and current status across clubs."
      />
      <div className="table-scroll">
        <table className="data-table">
        <thead>
          <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Club</th>
              <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.user?.name}</td>
              <td>{m.user?.email}</td>
              <td>{m.club?.name}</td>
                <td>
                  <span className={`status-pill ${m.status === 'APPROVED' ? 'success' : m.status === 'REJECTED' ? 'danger' : 'pending'}`}>
                    {m.status}
                  </span>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </section>
  );
}
