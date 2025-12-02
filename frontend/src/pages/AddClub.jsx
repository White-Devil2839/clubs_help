import { useState } from "react";
import { apiClient } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import Reveal from "../components/Reveal";

export default function AddClub() {
  const [form, setForm] = useState({ name: '', description: '', category: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Access Denied</h1>
            <p className="muted">You do not have permission to add clubs.</p>
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
    <div className="auth-container">
      <Reveal className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">Admin</span>
          <h1>Add a new club</h1>
          <p className="muted">Share the essentials and publish instantly for students to discover</p>
        </div>

        {success && <div className="alert alert-success">Club created successfully!</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="form-group">
            <label htmlFor="clubName">Club name</label>
            <input
              id="clubName"
              type="text"
              placeholder="e.g., Robotics Club"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe what your club is about..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category"
              value={form.category} 
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} 
              required
            >
              <option value="">Select category</option>
              <option value="TECH">Tech</option>
              <option value="NON_TECH">Non-Tech</option>
              <option value="EXTRACURRICULAR">Extracurricular</option>
            </select>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Creating club..." : "Create club"}
          </button>
        </form>
      </Reveal>
    </div>
  );
}