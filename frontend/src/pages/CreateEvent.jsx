import { useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function CreateEvent() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', date: '', clubId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user || user.role !== 'ADMIN') {
    return <div><h1>Forbidden</h1><p>You do not have permission to create events.</p></div>;
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
      
      const payload = {
        name: form.name,
        description: form.description,
        date: new Date(form.date).toISOString(),
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
    <div>
      <h1>Create Event</h1>
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
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          required
        />
        <input
          type="number"
          placeholder="Club ID (optional)"
          value={form.clubId}
          onChange={e => setForm(f => ({ ...f, clubId: e.target.value }))}
        />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</button>
      </form>
      {success && <div style={{ color: 'green' }}>Event created!</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
