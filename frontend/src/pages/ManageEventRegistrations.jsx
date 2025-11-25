import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

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
    return (
      <section className="page-card">
        <PageHeader title="Forbidden" description="You do not have permission to view this page." />
      </section>
    );
  }

  if (loading) return <div>Loading registrations...</div>;

  return (
    <section className="page-card">
      <Link to="/events" className="back-link">
        ← Back to events
      </Link>
      <PageHeader
        eyebrow="Admin"
        title="Manage event registrations"
        description="See who RSVP’d, along with timestamps and contact details."
      />
      {error && <div className="alert alert-error">{error}</div>}
      {event && (
        <div className="meta-grid" style={{ marginTop: '1rem' }}>
          <div className="meta-tile">
            <p className="muted">Event</p>
            <strong>{event.title}</strong>
          </div>
          {event.date && (
            <div className="meta-tile">
              <p className="muted">Date</p>
              <strong>{new Date(event.date).toLocaleString()}</strong>
            </div>
          )}
        </div>
      )}
      {registrations.length === 0 ? (
        <div className="empty-state">No registrations for this event just yet.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Registered at</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.id}>
                  <td>{reg.id}</td>
                  <td>{reg.user?.name || 'N/A'}</td>
                  <td>{reg.user?.email || 'N/A'}</td>
                  <td>{reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

