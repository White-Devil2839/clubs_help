import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { token, user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  function loadEvents() {
    apiClient.get('/events').then(res => {
      if (Array.isArray(res)) setEvents(res);
      else setError(res.message || 'Error loading events');
      setLoading(false);
    }).catch(e => { setError(e.message || 'Could not fetch events.'); setLoading(false); });
  }

  async function handleRegister(id) {
    setMessage("");
    try {
      const res = await apiClient.post(`/events/${id}/register`, {});
      if (res && res.id) setMessage('Registered successfully.');
      else setMessage(res.message || 'Registration failed.');
    } catch (e) {
      setMessage(e.message || 'Registration failed.');
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }
    
    setMessage("");
    setError("");
    try {
      await apiClient.del(`/events/${id}`);
      setMessage("Event deleted successfully");
      loadEvents(); // Reload the list
    } catch (e) {
      setError(e.message || "Failed to delete event");
    }
  }

  if (loading) return <div>Loading events...</div>;

  // Check if user is admin (case-insensitive)
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin');

  return (
    <section className="page-card">
      <Reveal>
        <PageHeader
          eyebrow="What’s on"
          title="Events calendar"
          description="Register in two taps and keep tabs on the most exciting happenings on campus."
          actions={
            isAdmin && (
              <Link to="/admin/create-event" className="btn btn-primary">
                Create event
              </Link>
            )
          }
        />
      </Reveal>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {events.length === 0 ? (
        <Reveal className="empty-state" delay={150}>No events found.</Reveal>
      ) : (
        <Reveal as="div" className="card-grid" delay={150}>
          {events.map((ev) => (
            <article key={ev.id} className="entity-card">
              <div className="card-header">
                <p className="eyebrow">{ev.type || "Event"}</p>
                <h3>{ev.title}</h3>
              </div>
              <p className="muted">{ev.description}</p>
              {ev.date && (
                <div className="card-meta">
                  <span>{new Date(ev.date).toLocaleString()}</span>
                </div>
              )}
              <div className="card-actions">
                {token ? (
                  <button className="btn btn-secondary" onClick={() => handleRegister(ev.id)}>
                    Quick register
                  </button>
                ) : (
                  <span className="muted">Login to register</span>
                )}
                <Link to={`/events/${ev.id}/register`} className="btn btn-link">
                  Open page
                </Link>
                {isAdmin && (
                  <>
                    <Link to={`/events/${ev.id}/manage`} className="btn btn-outline">
                      Manage registrations
                    </Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(ev.id, ev.title)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </Reveal>
      )}
    </section>
  );
}
