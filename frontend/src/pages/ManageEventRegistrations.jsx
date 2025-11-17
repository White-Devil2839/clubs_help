import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ManageEventRegistrations() {
  const { id } = useParams();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch event info
    apiClient.get(`/events/${id}`).then(res => {
      if (res && res.id) setEvent(res);
    }).catch(e => console.error('Error fetching event:', e));

    // Fetch registrations
    apiClient.get(`/events/${id}/registrations`).then(res => {
      if (Array.isArray(res)) setRegistrations(res);
      else setError(res.message || 'Failed to load registrations');
      setLoading(false);
    }).catch(e => {
      setError(e.message || 'Failed to load registrations');
      setLoading(false);
    });
  }, [id]);

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin');
  if (!user || !isAdmin) {
    return <div><h1>Forbidden</h1><p>You do not have permission to view this page.</p></div>;
  }

  if (loading) return <div>Loading registrations...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/events" style={{ marginRight: 12 }}>← Back to Events</Link>
      </div>
      <h1>Manage Event Registrations</h1>
      {event && (
        <div style={{ marginBottom: 20, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          {event.date && <p><b>Date:</b> {new Date(event.date).toLocaleString()}</p>}
        </div>
      )}
      <h2>Event Registrations ({registrations.length})</h2>
      {registrations.length === 0 ? (
        <p>No registrations found for this event.</p>
      ) : (
        <>
          <div style={{ marginBottom: 12, fontSize: 14, color: '#666' }}>
            Showing all users who have registered for this event.
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{reg.id}</td>
                  <td style={{ padding: 8 }}>{reg.user?.name || 'N/A'}</td>
                  <td style={{ padding: 8 }}>{reg.user?.email || 'N/A'}</td>
                  <td style={{ padding: 8 }}>
                    {reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

