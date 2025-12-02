import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import Reveal from '../components/Reveal';

export default function CreateEvent() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', date: '', clubId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [clubLoadError, setClubLoadError] = useState('');
  const [clubsLoading, setClubsLoading] = useState(true);
  const minDateValue = (() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  })();

  useEffect(() => {
    let isMounted = true;
    setClubsLoading(true);
    apiClient
      .get('/clubs')
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res)) {
          setClubs(res);
        } else {
          setClubLoadError(res?.message || 'Failed to fetch clubs');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setClubLoadError(err.message || 'Failed to fetch clubs');
      })
      .finally(() => {
        if (isMounted) setClubsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Access Denied</h1>
            <p className="muted">You do not have permission to create events.</p>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      // Validate date before sending
      if (!form.date) {
        setError('Date is required');
        setLoading(false);
        return;
      }

      const eventDate = new Date(form.date);
      if (eventDate <= new Date()) {
        setError('Event date must be in the future.');
        setLoading(false);
        return;
      }
      
      const payload = {
        name: form.name,
        description: form.description,
        date: eventDate.toISOString(),
        clubId: form.clubId && form.clubId.trim() !== '' ? Number(form.clubId) : null,
      };
      
      const res = await apiClient.post('/admin/event', payload);
      if (res && res.id) {
        setSuccess(true);
        setForm({ name: '', description: '', date: '', clubId: '' });
      } else {
        setError(res.message || 'Failed to create event');
      }
    } catch (e) {
      console.error('Error creating event:', e);
      setError(e.message || 'Failed to create event');
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <Reveal className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">Admin</span>
          <h1>Create an event</h1>
          <p className="muted">Launch an event with a clear description and optional club association</p>
        </div>

        {success && <div className="alert alert-success">Event created successfully!</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="eventName">Event name</label>
            <input
              id="eventName"
              placeholder="e.g., Annual Tech Fest"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe what the event is about..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventDate">Event date & time</label>
            <input
              id="eventDate"
              type="datetime-local"
              value={form.date}
              min={minDateValue}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clubId">Associated club (optional)</label>
            <select
              id="clubId"
              value={form.clubId}
              onChange={e => setForm(f => ({ ...f, clubId: e.target.value }))}
              disabled={clubsLoading || !!clubLoadError || clubs.length === 0}
            >
              <option value="">
                {clubsLoading
                  ? 'Loading clubs...'
                  : clubLoadError
                  ? 'Unable to load clubs'
                  : 'No specific club (general event)'}
              </option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
            {clubLoadError && <p className="form-hint" style={{ color: 'var(--danger)' }}>{clubLoadError}</p>}
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating event...' : 'Create event'}
          </button>
        </form>
      </Reveal>
    </div>
  );
}
