import { useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', form);
      if (res.token && res.user) {
        login(res.token, res.user);
        navigate('/');
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
    setLoading(false);
  }

  return (
    <section className="page-card">
      <Reveal>
        <PageHeader
          eyebrow="Welcome back"
          title="Log in to continue"
          description="Access your memberships, events, and admin tools."
        />
      </Reveal>
      <Reveal as="form" onSubmit={handleSubmit} autoComplete="off" delay={120}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </Reveal>
      <p className="muted">
        Need an account? <Link to="/register">Register here</Link>
      </p>
      {error && <div className="alert alert-error">{error}</div>}
    </section>
  );
}
