import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

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
    return (
      <section className="page-card">
        <PageHeader title="Forbidden" description="You do not have permission to view this page." />
      </section>
    );
  }

  if (loading) return <div>Loading members...</div>;

  return (
    <section className="page-card">
      <Link to={`/clubs/${id}`} className="back-link">
        ← Back to club
      </Link>
      <PageHeader
        eyebrow="Admin"
        title="Manage club members"
        description="Review applications and approve or reject directly."
      />
      {club && (
        <div className="meta-grid" style={{ marginTop: '1rem' }}>
          <div className="meta-tile">
            <p className="muted">Club</p>
            <strong>{club.name}</strong>
          </div>
          <div className="meta-tile">
            <p className="muted">Pending requests</p>
            <strong>{members.filter(m => m.status === 'PENDING').length}</strong>
          </div>
        </div>
      )}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {members.length === 0 ? (
        <div className="empty-state">No membership applications for this club.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.user?.name || 'N/A'}</td>
                  <td>{m.user?.email || 'N/A'}</td>
                  <td>
                    <span className={`status-pill ${m.status === 'APPROVED' ? 'success' : m.status === 'REJECTED' ? 'danger' : 'pending'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {m.status === 'PENDING' ? (
                      <div className="card-actions">
                        <button className="btn btn-secondary" onClick={() => handleApprove(m.id, m.user?.name || 'User')}>
                          Approve
                        </button>
                        <button className="btn btn-danger" onClick={() => handleReject(m.id, m.user?.name || 'User')}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="muted">{m.status === 'APPROVED' ? 'Approved' : 'Rejected'}</span>
                    )}
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

