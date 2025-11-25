import { useState } from "react";
import { apiClient } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";

export default function AddClub() {
  const [form, setForm] = useState({ name: '', description: '', category: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (!user || user.role !== 'ADMIN') {
    return (
      <section className="page-card">
        <PageHeader title="Forbidden" description="You do not have permission to add clubs." />
      </section>
    );
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
        setForm({ name: '', description: '', category: '' });
      } else {
        setError(res.message || 'Failed to create club');
      }
    } catch (err) {
      console.error('Error creating club:', err);
      setError(err.message || 'Failed to create club');
    }
    setLoading(false);
  }

  return (
    <section className="page-card">
      <Reveal>
        <PageHeader
          eyebrow="Admin"
          title="Add a new club"
          description="Share the essentials and publish instantly for students to discover."
        />
      </Reveal>
      <Reveal as="form" onSubmit={handleSubmit} autoComplete="off" delay={120}>
        <input
          type="text"
          placeholder="Club name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          required
        />
        <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required>
          <option value="">Select category</option>
          <option value="TECH">Tech</option>
          <option value="NON_TECH">Non-Tech</option>
          <option value="EXTRACURRICULAR">Extracurricular</option>
        </select>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add club"}
        </button>
      </Reveal>
      {success && <div className="alert alert-success">Club created successfully!</div>}
      {error && <div className="alert alert-error">{error}</div>}
    </section>
  );
}
