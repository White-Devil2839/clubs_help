import { useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', rolePreference: 'MEMBER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', form);
      if (res.token && res.user) {
        login(res.token, res.user);
        navigate('/');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <Reveal className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">Join the community</span>
          <h1>Create your account</h1>
          <p className="muted">Register to apply for memberships, RSVP for events, and track your activity</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account type</label>
            <select
              id="role"
              value={form.rolePreference}
              onChange={e => setForm(f => ({ ...f, rolePreference: e.target.value }))}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin (request)</option>
            </select>
            <p className="form-hint">New accounts start as MEMBER. Admin access can be granted later.</p>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="muted">
            Already have an account? <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
}