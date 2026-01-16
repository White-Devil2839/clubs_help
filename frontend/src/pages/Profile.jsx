import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';

import '../styles/dashboard.css';

const Profile = () => {
  const { institutionCode } = useParams();
  const [memberships, setMemberships] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchData();
  }, [institutionCode]);

  const fetchData = async () => {
    try {
      const memRes = await api.get(`/${institutionCode}/me/memberships`);
      setMemberships(memRes.data);
      const regRes = await api.get(`/${institutionCode}/me/event-registrations`);
      setRegistrations(regRes.data);
    } catch (error) {
      console.error('Error fetching profile data', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="section-container">
        <h1 className="dashboard-title">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="section-container">
          <h2 className="section-title mb-4">My Club Memberships</h2>
          {memberships.length === 0 ? (
            <p className="text-gray-500">No memberships yet.</p>
          ) : (
            <div className="flex flex-col">
              {memberships.map((mem) => (
                <div key={mem._id} className="list-item">
                  <span className="font-medium text-lg">{mem.clubId.name}</span>
                  <span className={`status-badge ${mem.status === 'APPROVED' ? 'status-active' : mem.status === 'REJECTED' ? 'badge-danger' : 'status-pending'}`}>
                    {mem.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-container">
          <h2 className="section-title mb-4">Registered Events</h2>
          {registrations.length === 0 ? (
            <p className="text-gray-500">No event registrations yet.</p>
          ) : (
            <div className="flex flex-col">
              {registrations.map((reg) => (
                <div key={reg._id} className="list-item">
                  <div className="item-info">
                      <h4>{reg.eventId.title}</h4>
                      <p>{new Date(reg.eventId.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Change Password Section */}
      <ChangePassword />
    </div>
  );
};

const ChangePassword = () => {
  const { institutionCode } = useParams();
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passData.newPassword !== passData.confirmPassword) {
      return setError("New passwords don't match");
    }

    try {
      // NOTE: The backend route is global /api/auth/password 
      // but our axios instance might be base url + /:code
      // The route we added is router.put('/auth/password'...) in global scope?
      // No, authRoutes is mounted at /api/ (global) AND implied /api/:code?
      // In server.js: app.use('/api', authRoutes);
      // It is NOT mounted under /api/:institutionCode by default unless institutionMiddleware logic allows.
      // institutionMiddleware is applied to /api/:institutionCode
      // But authRoutes isn't mounted there.
      // However, we can call the global route.
      // Let's force the global route path.
      await api.put('/auth/password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      setMessage('Password updated successfully');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="section-container max-w-md">
      <h2 className="section-title mb-4">Change Password</h2>
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm font-medium">{message}</div>}
      {error && <div className="status-badge bg-red-100 text-red-700 mb-4 block w-full text-center normal-case">{error}</div>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
           <label className="label">Current Password</label>
           <input
             type="password"
             name="currentPassword"
             className="input"
             value={passData.currentPassword}
             onChange={handleChange}
             required
           />
        </div>
        <div>
           <label className="label">New Password</label>
           <input
             type="password"
             name="newPassword"
             className="input"
             value={passData.newPassword}
             onChange={handleChange}
             required
             minLength={6}
           />
        </div>
        <div>
           <label className="label">Confirm New Password</label>
           <input
             type="password"
             name="confirmPassword"
             className="input"
             value={passData.confirmPassword}
             onChange={handleChange}
             required
             minLength={6}
           />
        </div>
        <button type="submit" className="btn-full-width">Update Password</button>
      </form>
    </div>
  );
};

export default Profile;
