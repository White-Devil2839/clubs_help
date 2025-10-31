import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

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

  if (!user || user.role !== 'ADMIN') return <div><h1>Forbidden</h1></div>;
  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h1>Manage Users</h1>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign:'left' }}>ID</th>
            <th style={{ textAlign:'left' }}>Name</th>
            <th style={{ textAlign:'left' }}>Email</th>
            <th style={{ textAlign:'left' }}>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== 'ADMIN' && (
                  <button onClick={() => handlePromote(u.id)}>Promote to Admin</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
