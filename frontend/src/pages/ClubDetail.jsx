import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";

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
  if (error && !club) {
    return (
      <section className="page-card">
        <Link to="/clubs" className="back-link">
          ← Back to clubs
        </Link>
        <PageHeader title="Unable to load club" description={error} />
      </section>
    );
  }
  if (!club) return null;

  // Debug: Check user role
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin');
  const isStudent = user && user.role !== 'ADMIN' && user.role !== 'admin';

  return (
    <section className="page-card">
      <Link to="/clubs" className="back-link">
        ← Back to clubs
      </Link>
      <Reveal>
        <PageHeader
          eyebrow={club.category || "Club"}
          title={club.name}
          description={club.description}
          actions={
            isAdmin && (
              <div className="header-actions">
                <Link to={`/clubs/${id}/manage`} className="btn btn-secondary">
                  Manage members
                </Link>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete club
                </button>
              </div>
            )
          }
        />
      </Reveal>
      <Reveal className="meta-grid" delay={150}>
        <div className="meta-tile">
          <p className="muted">Approval</p>
          <strong>{club.approved ? "Approved" : "Pending"}</strong>
        </div>
        <div className="meta-tile">
          <p className="muted">Active members</p>
          <strong>{club.memberships?.length || 0}</strong>
      </div>
      </Reveal>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <Reveal className="card-actions" style={{ marginTop: '1.2rem' }} delay={200}>
        {isStudent && !isEnrolled && (
          <button className="btn btn-primary" onClick={handleEnroll}>
            Apply for membership
          </button>
        )}
        {isStudent && isEnrolled && (
          <span className={`status-pill ${enrollmentStatus === 'APPROVED' ? 'success' : 'pending'}`}>
            Membership status: {enrollmentStatus}
          </span>
        )}
      </Reveal>
    </section>
  );
}
