import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function MyActivity() {
  const { token } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [m, r] = await Promise.all([
          apiClient.get('/me/memberships'),
          apiClient.get('/me/event-registrations'),
        ]);
        setMemberships(Array.isArray(m) ? m : []);
        setRegistrations(Array.isArray(r) ? r : []);
      } catch (e) {
        setError(e.message || 'Failed to load');
      }
      setLoading(false);
    }
    if (token) load();
  }, [token]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return registrations.filter(x => x.event?.date && new Date(x.event.date).getTime() > now);
  }, [registrations]);

  if (!token) return <div><h1>My Activity</h1><p>Please login to view your activity.</p></div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h1>My Activity</h1>

      <h2 style={{ marginTop: 16 }}>Memberships</h2>
      {memberships.length === 0 ? (
        <p>No memberships yet.</p>
      ) : (
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign:'left' }}>Club</th>
              <th style={{ textAlign:'left' }}>Approved</th>
              <th style={{ textAlign:'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map(m => (
              <tr key={m.id}>
                <td>{m.club?.name}</td>
                <td>{m.club?.approved ? 'Yes' : 'No'}</td>
                <td>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: 24 }}>Upcoming Registered Events</h2>
      {upcoming.length === 0 ? (
        <p>No upcoming registered events.</p>
      ) : (
        <ul>
          {upcoming.map(r => (
            <li key={r.id}>
              <div style={{ fontWeight: 600 }}>{r.event?.title}</div>
              <div>{r.event?.date ? new Date(r.event.date).toLocaleString() : ''}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
