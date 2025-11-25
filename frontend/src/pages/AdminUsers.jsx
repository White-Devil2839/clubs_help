import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/users').then(res => {
      if (Array.isArray(res)) setUsers(res);
      else setError(res.message || 'Failed to load users');
      setLoading(false);
    }).catch(e => { setError(e.message || 'Failed to load users'); setLoading(false); });
  }, []);

  async function handlePromote(id) {
    try {
      const updated = await apiClient.post(`/admin/users/${id}/promote`, {});
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    } catch (e) {
      alert(e.message || 'Failed to promote user');
    }
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <section className="page-card">
        <PageHeader title="Forbidden" description="Admins only." />
      </section>
    );
  }
  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <section className="page-card">
      <PageHeader
        eyebrow="Admin"
        title="Manage users"
        description="Promote leaders to admins and keep your roster up to date."
      />
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`status-pill ${u.role === 'ADMIN' ? 'success' : ''}`}>{u.role}</span>
                </td>
                <td>
                  {u.role !== 'ADMIN' && (
                    <button className="btn btn-secondary" onClick={() => handlePromote(u.id)}>
                      Promote to admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
