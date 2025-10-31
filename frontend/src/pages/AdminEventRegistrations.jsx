import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

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

  if (!user || user.role !== 'ADMIN') return <div><h1>Forbidden</h1></div>;
  if (loading) return <div>Loading event registrations...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h1>Event Registrations</h1>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign:'left' }}>ID</th>
            <th style={{ textAlign:'left' }}>User</th>
            <th style={{ textAlign:'left' }}>Email</th>
            <th style={{ textAlign:'left' }}>Event</th>
            <th style={{ textAlign:'left' }}>Date</th>
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
  );
}
