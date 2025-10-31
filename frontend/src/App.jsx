import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import AddClub from "./pages/AddClub";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Events from "./pages/Events";
import EventRegister from "./pages/EventRegister";
import CreateEvent from "./pages/CreateEvent";
import AdminUsers from "./pages/AdminUsers";
import AdminMemberships from "./pages/AdminMemberships";
import AdminEventRegistrations from "./pages/AdminEventRegistrations";
import MyActivity from "./pages/MyActivity";

function ProtectedRoute({ children, roles }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function Nav() {
  const { token, user, logout } = useAuth();
  return (
    <nav style={{ padding: 10, borderBottom: "1px solid #eee", marginBottom: 20, display:'flex', alignItems:'center', gap:16 }}>
      <a href="/">Home</a>
      <a href="/clubs">Clubs</a>
      <a href="/events">Events</a>
      {token && <a href="/me">My Activity</a>}
      {user?.role === 'ADMIN' && <a href="/add-club">Add Club</a>}
      {user?.role === 'ADMIN' && <a href="/admin/create-event">Create Event</a>}
      {user?.role === 'ADMIN' && <a href="/admin/users">Users</a>}
      {user?.role === 'ADMIN' && <a href="/admin/memberships">Memberships</a>}
      {user?.role === 'ADMIN' && <a href="/admin/event-registrations">Event Registrations</a>}
      <div style={{ marginLeft: 'auto' }}>
        {token && user ? (
          <>
            <span style={{ marginRight: 12 }}>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/register" style={{ marginRight: 16 }}>Register</a>
            <a href="/login">Login</a>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/:id" element={<ClubDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id/register" element={<ProtectedRoute><EventRegister /></ProtectedRoute>} />
            <Route path="/me" element={<ProtectedRoute><MyActivity /></ProtectedRoute>} />
            <Route path="/add-club" element={<ProtectedRoute roles={["ADMIN"]}><AddClub /></ProtectedRoute>} />
            <Route path="/admin/create-event" element={<ProtectedRoute roles={["ADMIN"]}><CreateEvent /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/memberships" element={<ProtectedRoute roles={["ADMIN"]}><AdminMemberships /></ProtectedRoute>} />
            <Route path="/admin/event-registrations" element={<ProtectedRoute roles={["ADMIN"]}><AdminEventRegistrations /></ProtectedRoute>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
