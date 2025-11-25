import { useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
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
    <section className="page-card">
      <Reveal>
        <PageHeader
          eyebrow="Join"
          title="Create your account"
          description="Register once to apply for memberships, RSVP for events, and track your activity."
        />
      </Reveal>
      <Reveal as="form" onSubmit={handleSubmit} autoComplete="off" delay={120}>
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
        />
        <select
          value={form.rolePreference}
          onChange={e => setForm(f => ({ ...f, rolePreference: e.target.value }))}
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin (request)</option>
        </select>
        <p className="muted">New accounts start as MEMBER. Admin access can be granted later.</p>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </Reveal>
      <p className="muted">
        Already registered? <Link to="/login">Log in</Link>
      </p>
      {error && <div className="alert alert-error">{error}</div>}
    </section>
  );
}
