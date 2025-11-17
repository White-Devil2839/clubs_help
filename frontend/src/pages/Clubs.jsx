import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h1>Clubs</h1>
      {message && <div style={{color:'green'}}>{message}</div>}
      {clubs.length === 0 ? (
        <p>No clubs found.</p>
      ) : (
        <ul>
          {clubs.map(club => (
            <li key={club.id} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to={`/clubs/${club.id}`}>{club.name}</Link>
              {user && user.role === 'ADMIN' && (
                <button 
                  onClick={() => handleDelete(club.id, club.name)}
                  style={{ 
                    padding: '4px 8px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
