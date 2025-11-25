import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    loadClubs();
  }, []);

  function loadClubs() {
    apiClient.get("/clubs").then(res => {
      if (Array.isArray(res)) setClubs(res);
      else setError(res.message || "Error loading clubs");
      setLoading(false);
    }).catch((e) => {
      setError(e.message || "Could not fetch clubs.");
      setLoading(false);
    });
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    
    setMessage("");
    setError("");
    try {
      await apiClient.del(`/clubs/${id}`);
      setMessage("Club deleted successfully");
      loadClubs(); // Reload the list
    } catch (e) {
      setError(e.message || "Failed to delete club");
    }
  }

  if (loading) return <div>Loading clubs...</div>;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <section className="page-card">
      <Reveal>
        <PageHeader
          eyebrow="Discover"
          title="Clubs directory"
          description="Browse every active club, view details, and request membership in seconds."
          actions={
            isAdmin && (
              <Link to="/add-club" className="btn btn-primary">
                Add club
              </Link>
            )
          }
        />
      </Reveal>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {clubs.length === 0 ? (
        <Reveal className="empty-state" delay={150}>
          <p>No clubs found yet. Be the first to create one!</p>
        </Reveal>
      ) : (
        <Reveal as="div" className="card-grid" delay={150}>
          {clubs.map((club) => (
            <article key={club.id} className="entity-card">
              <div className="card-header">
                <p className="eyebrow">{club.category || "CLUB"}</p>
                <h3>{club.name}</h3>
              </div>
              <p className="muted">{club.description}</p>
              <div className="card-meta">
                <span className={`status-pill ${club.approved ? "success" : "pending"}`}>
                  {club.approved ? "Approved" : "Pending approval"}
                </span>
                <span>{club.memberships?.length || 0} members</span>
              </div>
              <div className="card-actions">
                <Link to={`/clubs/${club.id}`} className="btn btn-outline">
                  View club
                </Link>
                {isAdmin && (
                  <button className="btn btn-danger" onClick={() => handleDelete(club.id, club.name)}>
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </Reveal>
      )}
    </section>
  );
}
