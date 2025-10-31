import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { useParams } from "react-router-dom";

export default function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get(`/clubs/${id}`).then(res => {
      if (res && res.id) setClub(res);
      else setError(res.message || "Club not found");
      setLoading(false);
    }).catch((e) => {
      setError(e.message || "Could not fetch club.");
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div>Loading club...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!club) return null;

  return (
    <div>
      <h1>{club.name}</h1>
      <p>{club.description}</p>
      <p><b>Approved:</b> {club.approved ? "Yes" : "No"}</p>
      <p><b>ID:</b> {club.id}</p>
    </div>
  );
}
