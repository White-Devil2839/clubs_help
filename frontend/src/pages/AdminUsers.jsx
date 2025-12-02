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

  async function handleDelete(id, userName) {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This will remove all their memberships and event registrations. This action cannot be undone.`)) {
      return;
    }
    try {
      await apiClient.del(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      alert(e.message || 'Failed to delete user');
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
      {users.length === 0 ? (
        <div className="empty-state">No users found.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`status-pill ${u.role === 'ADMIN' ? 'success' : 'pending'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      {u.role !== 'ADMIN' && (
                        <button className="btn btn-secondary" onClick={() => handlePromote(u.id)}>
                          Promote
                        </button>
                      )}
                      {u.id !== user.id && (
                        <button className="btn btn-danger" onClick={() => handleDelete(u.id, u.name)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
