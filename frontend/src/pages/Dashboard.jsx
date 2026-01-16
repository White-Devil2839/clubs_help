import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from '../components/Button';

import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { institutionCode } = useParams();

  return (
    <div className="dashboard-container">
      <div className="section-container">
        <h1 className="dashboard-title">Welcome, {user?.name}!</h1>
        <p className="dashboard-subtitle">You are logged in as {user?.role}</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3 className="text-xl font-bold mb-2">Clubs</h3>
          <p className="text-gray-500 mb-4 flex-grow">Explore and join clubs in your institution.</p>
          <Link to={`/${institutionCode}/clubs`}>
            <Button className="w-full">View Clubs</Button>
          </Link>
        </div>

        <div className="stat-card">
          <h3 className="text-xl font-bold mb-2">Events</h3>
          <p className="text-gray-500 mb-4 flex-grow">Discover upcoming events and activities.</p>
          <Link to={`/${institutionCode}/events`}>
            <Button className="w-full">View Events</Button>
          </Link>
        </div>

        {user?.role === 'ADMIN' && (
          <div className="stat-card">
            <h3 className="text-xl font-bold mb-2">Admin Panel</h3>
            <p className="text-gray-500 mb-4 flex-grow">Manage clubs, approve requests, and create events.</p>
            <Link to={`/${institutionCode}/admin`}>
              <Button variant="danger" className="w-full">Go to Admin</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
