import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    apiClient.get('/events').then(res => {
      if (Array.isArray(res)) setEvents(res);
      else setError(res.message || 'Error loading events');
      setLoading(false);
    }).catch(e => { setError(e.message || 'Could not fetch events.'); setLoading(false); });
  }, []);

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

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h1>Events</h1>
      {message && <div style={{color:'green'}}>{message}</div>}
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map(ev => (
            <li key={ev.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600 }}>{ev.title}</div>
              <div>{ev.description}</div>
              {ev.date && <div>{new Date(ev.date).toLocaleString()}</div>}
              {token ? (
                <button style={{ marginTop: 6 }} onClick={() => handleRegister(ev.id)}>Register</button>
              ) : (
                <span style={{ fontSize: 14, color: '#666' }}>Login to register</span>
              )}
              <div style={{ marginTop: 4 }}>
                <Link to={`/events/${ev.id}/register`}>Open registration page</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
