import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

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

  if (!token) {
    return (
      <section className="page-card">
        <PageHeader title="My activity" description="Please login to view your activity." />
      </section>
    );
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <>
      <section className="page-card">
        <Reveal>
          <PageHeader
            eyebrow="Dashboard"
            title="My activity"
            description="Track club memberships and upcoming events you’ve registered for."
          />
        </Reveal>
      {memberships.length === 0 ? (
          <Reveal className="empty-state" delay={120}>No memberships yet.</Reveal>
      ) : (
          <Reveal className="table-scroll" delay={120}>
            <table className="data-table">
          <thead>
            <tr>
                  <th>Club</th>
                  <th>Approved</th>
                  <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map(m => (
              <tr key={m.id}>
                <td>{m.club?.name}</td>
                <td>{m.club?.approved ? 'Yes' : 'No'}</td>
                    <td>
                      <span className={`status-pill ${m.status === 'APPROVED' ? 'success' : m.status === 'REJECTED' ? 'danger' : 'pending'}`}>
                        {m.status}
                      </span>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
          </Reveal>
        )}
      </section>

      <section className="page-card">
        <Reveal>
          <PageHeader
            eyebrow="Next up"
            title="Upcoming registered events"
            description="Stay ready for every RSVP."
          />
        </Reveal>
      {upcoming.length === 0 ? (
          <Reveal className="empty-state" delay={120}>No upcoming registered events.</Reveal>
      ) : (
          <Reveal as="ul" className="stack-list" delay={120}>
          {upcoming.map(r => (
            <li key={r.id}>
              <div style={{ fontWeight: 600 }}>{r.event?.title}</div>
                <div className="muted">{r.event?.date ? new Date(r.event.date).toLocaleString() : ''}</div>
            </li>
          ))}
          </Reveal>
      )}
      </section>
    </>
  );
}
