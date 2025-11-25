import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

export default function AdminEventRegistrations() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/admin/event-registrations').then(res => {
      if (Array.isArray(res)) setItems(res);
      else setError(res.message || 'Failed to load registrations');
      setLoading(false);
    }).catch(e => { setError(e.message || 'Failed to load registrations'); setLoading(false); });
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <section className="page-card">
        <PageHeader title="Forbidden" description="Admins only." />
      </section>
    );
  }
  if (loading) return <div>Loading event registrations...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <section className="page-card">
      <PageHeader
        eyebrow="Admin"
        title="Event registrations"
        description="Monitor demand and manage attendees across every event."
      />
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Event</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.user?.name}</td>
                <td>{r.user?.email}</td>
                <td>{r.event?.title}</td>
                <td>{r.event?.date ? new Date(r.event.date).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
