import { useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          placeholder="Full Name"
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
        <small style={{ color:'#666' }}>New accounts start as MEMBER. Admin access can be granted later.</small>
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      {error && <div style={{color:'red', marginTop:10}}>{error}</div>}
    </div>
  );
}
