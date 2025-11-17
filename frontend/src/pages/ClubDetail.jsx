import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  useEffect(() => {
    loadClub();
  }, [id, user]);

  function loadClub() {
    apiClient.get(`/clubs/${id}`).then(res => {
      if (res && res.id) {
        setClub(res);
        // Check if user is already enrolled
        if (user && res.memberships) {
          const userMembership = res.memberships.find(m => 
            m.userId === user.id || m.user?.id === user.id
          );
          if (userMembership) {
            setIsEnrolled(true);
            setEnrollmentStatus(userMembership.status);
          }
        }
      } else {
        setError(res.message || "Club not found");
      }
      setLoading(false);
    }).catch((e) => {
      setError(e.message || "Could not fetch club.");
      setLoading(false);
    });
  }

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete "${club.name}"? This action cannot be undone.`)) {
      return;
    }
    
    setMessage("");
    setError("");
    try {
      await apiClient.del(`/clubs/${id}`);
      setMessage("Club deleted successfully");
      setTimeout(() => {
        navigate('/clubs');
      }, 1500);
    } catch (e) {
      setError(e.message || "Failed to delete club");
    }
  }

  async function handleEnroll() {
    setMessage("");
    setError("");
    try {
      await apiClient.post(`/clubs/${id}/enroll`, {});
      setMessage("Membership request submitted successfully!");
      setIsEnrolled(true);
      setEnrollmentStatus('PENDING');
      loadClub(); // Reload to get updated data
    } catch (e) {
      setError(e.message || "Failed to apply for membership");
    }
  }

  if (loading) return <div>Loading club...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!club) return null;

  // Debug: Check user role
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin');
  const isStudent = user && user.role !== 'ADMIN' && user.role !== 'admin';

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/clubs">← Back to Clubs</Link>
      </div>
      <h1>{club.name}</h1>
      <p>{club.description}</p>
      <p><b>Category:</b> {club.category}</p>
      <p><b>Approved:</b> {club.approved ? "Yes" : "No"}</p>
      <p><b>Members:</b> {club.memberships?.length || 0}</p>
      
      {message && <div style={{color:'green', marginTop: 12, padding: 8, backgroundColor: '#d4edda', borderRadius: 4}}>{message}</div>}
      {error && <div style={{color:'red', marginTop: 12, padding: 8, backgroundColor: '#f8d7da', borderRadius: 4}}>{error}</div>}
      
      <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {/* Student: Apply for membership */}
        {isStudent && !isEnrolled && (
          <button 
            onClick={handleEnroll}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Apply for Membership
          </button>
        )}
        
        {/* Show enrollment status for students */}
        {isStudent && isEnrolled && (
          <div style={{ 
            padding: '8px 16px', 
            backgroundColor: enrollmentStatus === 'APPROVED' ? '#d4edda' : '#fff3cd',
            color: enrollmentStatus === 'APPROVED' ? '#155724' : '#856404',
            borderRadius: 4
          }}>
            Membership Status: <strong>{enrollmentStatus}</strong>
          </div>
        )}
        
        {/* Admin: Manage members */}
        {isAdmin && (
          <Link 
            to={`/clubs/${id}/manage`}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: 4,
              display: 'inline-block'
            }}
          >
            Manage Members
          </Link>
        )}
        
        {/* Admin: Delete club */}
        {isAdmin && (
          <button 
            onClick={handleDelete}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Delete Club
          </button>
        )}
      </div>
    </div>
  );
}
