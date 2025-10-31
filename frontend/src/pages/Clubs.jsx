import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { Link } from "react-router-dom";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get("/clubs").then(res => {
      if (Array.isArray(res)) setClubs(res);
      else setError(res.message || "Error loading clubs");
      setLoading(false);
    }).catch((e) => {
      setError(e.message || "Could not fetch clubs.");
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading clubs...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h1>Clubs</h1>
      {clubs.length === 0 ? (
        <p>No clubs found.</p>
      ) : (
        <ul>
          {clubs.map(club => (
            <li key={club.id}>
              <Link to={`/clubs/${club.id}`}>{club.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
