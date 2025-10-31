import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div>
      <h1>{user ? `Welcome, ${user.name}` : 'Home'}</h1>
      <p>{user ? 'Explore clubs and events.' : 'Welcome to the Club Portal!'}</p>
    </div>
  );
}
