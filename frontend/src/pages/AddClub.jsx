import { useState } from "react";
import { apiClient } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

export default function AddClub() {
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (!user || user.role !== 'ADMIN') {
    return <div><h1>Forbidden</h1><p>You do not have permission to add clubs.</p></div>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const res = await apiClient.post('/clubs', form);
      if (res && res.id) {
        setSuccess(true);
        setForm({ name: '', description: '' });
      } else {
        setError(res.message || 'Failed to create club');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
    setLoading(false);
  }

  return (
    <div>
      <h1>Add Club</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          placeholder="Club Name"
          value={form.name}
          onChange={e=>setForm(f=>({...f, name:e.target.value}))}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e=>setForm(f=>({...f, description:e.target.value}))}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Club'}</button>
      </form>
      {success && <div style={{color:'green'}}>Club request submitted!</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}
