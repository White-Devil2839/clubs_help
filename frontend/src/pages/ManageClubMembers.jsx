import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ManageClubMembers() {
  const { id } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  function loadData() {
    // Fetch club info
    apiClient.get(`/clubs/${id}`).then(res => {
      if (res && res.id) setClub(res);
    }).catch(e => console.error('Error fetching club:', e));

    // Fetch members
    setLoading(true);
    apiClient.get(`/clubs/${id}/members`).then(res => {
      if (Array.isArray(res)) setMembers(res);
      else setError(res.message || 'Failed to load members');
      setLoading(false);
    }).catch(e => {
      setError(e.message || 'Failed to load members');
      setLoading(false);
    });
  }

  async function handleApprove(membershipId, userName) {
    if (!window.confirm(`Approve membership request for ${userName}?`)) {
      return;
    }
    
    setMessage('');
    setError('');
    try {
      await apiClient.patch(`/admin/member/${membershipId}/approve`);
      setMessage(`Membership request for ${userName} has been approved.`);
      loadData(); // Reload the list
    } catch (e) {
      setError(e.message || 'Failed to approve membership request');
    }
  }

  async function handleReject(membershipId, userName) {
    if (!window.confirm(`Reject membership request for ${userName}?`)) {
      return;
    }
    
    setMessage('');
    setError('');
    try {
      await apiClient.patch(`/admin/member/${membershipId}/reject`);
      setMessage(`Membership request for ${userName} has been rejected.`);
      loadData(); // Reload the list
    } catch (e) {
      setError(e.message || 'Failed to reject membership request');
    }
  }

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin');
  if (!user || !isAdmin) {
    return <div><h1>Forbidden</h1><p>You do not have permission to view this page.</p></div>;
  }

  if (loading) return <div>Loading members...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to={`/clubs/${id}`} style={{ marginRight: 12 }}>← Back to Club</Link>
      </div>
      <h1>Manage Club Members</h1>
      {club && (
        <div style={{ marginBottom: 20, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <h2>{club.name}</h2>
          <p>{club.description}</p>
        </div>
      )}
      <h2>Membership Applications ({members.length})</h2>
      {message && <div style={{color:'green', marginTop: 12, padding: 8, backgroundColor: '#d4edda', borderRadius: 4}}>{message}</div>}
      {error && <div style={{color:'red', marginTop: 12, padding: 8, backgroundColor: '#f8d7da', borderRadius: 4}}>{error}</div>}
      {members.length === 0 ? (
        <p>No membership applications found for this club.</p>
      ) : (
        <>
          <div style={{ marginBottom: 12, fontSize: 14, color: '#666' }}>
            Showing all users who have applied for membership in this club.
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Applied Date</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{m.id}</td>
                  <td style={{ padding: 8 }}>{m.user?.name || 'N/A'}</td>
                  <td style={{ padding: 8 }}>{m.user?.email || 'N/A'}</td>
                  <td style={{ padding: 8 }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      backgroundColor: m.status === 'APPROVED' ? '#d4edda' : m.status === 'PENDING' ? '#fff3cd' : '#f8d7da',
                      color: m.status === 'APPROVED' ? '#155724' : m.status === 'PENDING' ? '#856404' : '#721c24',
                      fontWeight: 500
                    }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: 8 }}>
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: 8 }}>
                    {m.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleApprove(m.id, m.user?.name || 'User')}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(m.id, m.user?.name || 'User')}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {m.status !== 'PENDING' && (
                      <span style={{ color: '#999', fontSize: 12 }}>
                        {m.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

