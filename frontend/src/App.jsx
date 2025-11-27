import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from "react-router-dom";
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
import ManageClubMembers from "./pages/ManageClubMembers";
import ManageEventRegistrations from "./pages/ManageEventRegistrations";
import MyActivity from "./pages/MyActivity";

function ProtectedRoute({ children, roles }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function Nav() {
  const { token, user, logout } = useAuth();
  const baseLinks = [
    { to: "/", label: "Home" },
    { to: "/clubs", label: "Clubs" },
    { to: "/events", label: "Events" },
  ];
  const memberLinks = token ? [{ to: "/me", label: "My Activity" }] : [];
  const adminLinks =
    user?.role === "ADMIN"
      ? [
          { to: "/add-club", label: "Add Club" },
          { to: "/admin/create-event", label: "Create Event" },
          { to: "/admin/users", label: "Users" },
          { to: "/admin/memberships", label: "Memberships" },
          { to: "/admin/event-registrations", label: "Registrations" },
        ]
      : [];

  const navItems = [...baseLinks, ...memberLinks, ...adminLinks];

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand">
          Clubs<span>Hub</span>
        </NavLink>
        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-right">
        {token && user ? (
          <>
              <span className="user-chip">{user.name}</span>
              <button className="btn btn-outline" onClick={logout}>
                Logout
              </button>
          </>
        ) : (
          <>
              <NavLink to="/register" className="btn btn-ghost">
                Register
              </NavLink>
              <NavLink to="/login" className="btn btn-primary">
                Login
              </NavLink>
          </>
        )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <div className="background-ornaments">
            <span className="orb orb-1" />
            <span className="orb orb-2" />
            <span className="orb orb-3" />
          </div>
        <Nav />
          <main className="page-shell">
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
            <Route path="/clubs/:id/manage" element={<ProtectedRoute roles={["ADMIN"]}><ManageClubMembers /></ProtectedRoute>} />
            <Route path="/events/:id/manage" element={<ProtectedRoute roles={["ADMIN"]}><ManageEventRegistrations /></ProtectedRoute>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          </main>
          <footer className="app-footer">
            Built with ❤️ for the clubs community.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
