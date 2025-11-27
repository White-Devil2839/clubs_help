import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

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
      <section className="page-card">
        <PageHeader title="Forbidden" description="You do not have permission to create events." />
      </section>
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
    <section className="page-card">
      <PageHeader
        eyebrow="Admin"
        title="Create an event"
        description="Launch an event with a clear description and optional club association."
      />
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Event name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          required
        />
        <input
          type="datetime-local"
          placeholder="Date"
          value={form.date}
          min={minDateValue}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          required
        />
        <select
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
        {clubLoadError && <p className="alert alert-error">{clubLoadError}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create event'}
        </button>
      </form>
      {success && <div className="alert alert-success">Event created!</div>}
      {error && <div className="alert alert-error">{error}</div>}
    </section>
  );
}
