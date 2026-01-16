import React, { useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from './Button';
import '../styles/layout.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { institutionCode } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(`/${institutionCode}/login`);
  };

  if (!institutionCode) return null;

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={`/${institutionCode}/dashboard`} className="nav-brand">
          CampusHub
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to={`/${institutionCode}/clubs`} className="nav-link">Clubs</Link>
              <Link to={`/${institutionCode}/events`} className="nav-link">Events</Link>
              {user.role === 'ADMIN' && (
                 <>
                   <Link to={`/${institutionCode}/admin`} className="nav-link">Admin</Link>
                   <Link to={`/${institutionCode}/institution`} className="nav-link">Institution</Link>
                 </>
              )}
              <Link to={`/${institutionCode}/profile`} className="nav-link">Profile</Link>
              <Button variant="secondary" onClick={handleLogout} className="text-sm">Logout</Button>
            </>
          ) : (
            <Link to={`/${institutionCode}/login`}>
              <Button className="text-sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
