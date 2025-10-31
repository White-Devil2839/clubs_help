import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function AdminMemberships() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/admin/memberships').then(res => {
      if (Array.isArray(res)) setItems(res);
      else setError(res.message || 'Failed to load memberships');
      setLoading(false);
    }).catch(e => { setError(e.message || 'Failed to load memberships'); setLoading(false); });
  }, []);

  if (!user || user.role !== 'ADMIN') return <div><h1>Forbidden</h1></div>;
  if (loading) return <div>Loading memberships...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h1>Club Memberships</h1>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign:'left' }}>ID</th>
            <th style={{ textAlign:'left' }}>User</th>
            <th style={{ textAlign:'left' }}>Email</th>
            <th style={{ textAlign:'left' }}>Club</th>
            <th style={{ textAlign:'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.user?.name}</td>
              <td>{m.user?.email}</td>
              <td>{m.club?.name}</td>
              <td>{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
