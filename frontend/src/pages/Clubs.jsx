import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

import '../styles/dashboard.css';

const Clubs = () => {
  const { institutionCode } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, [institutionCode]);

  const fetchData = async () => {
    try {
      const [clubsRes, membershipsRes] = await Promise.all([
        api.get(`/${institutionCode}/clubs`),
        api.get(`/${institutionCode}/me/memberships`)
      ]);
      setClubs(clubsRes.data);
      setMemberships(membershipsRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const getMembershipStatus = (clubId) => {
    return memberships.find(m => m.clubId._id === clubId);
  };

  const handleJoin = async (clubId) => {
    try {
      await api.post(`/${institutionCode}/clubs/${clubId}/join`);
      setMessage({ type: 'success', text: 'Join request sent! Waiting for admin approval.' });
      fetchData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error joining club' 
      });
    }
  };

  const getClubButton = (club) => {
    const membership = getMembershipStatus(club._id);

    if (!membership) {
      return (
        <Button onClick={() => handleJoin(club._id)} className="w-full">
          Join Club
        </Button>
      );
    }

    switch (membership.status) {
      case 'PENDING':
        return (
          <Button disabled className="w-full opacity-60">
            Request Pending
          </Button>
        );
      case 'APPROVED':
        return (
          <Button onClick={() => navigate(`/${institutionCode}/clubs/${club._id}`)} className="w-full">
            View Club
          </Button>
        );
      case 'REJECTED':
        return (
          <div className="text-sm text-red-600 text-center">Request Rejected</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="section-container">
        <h1 className="dashboard-title">Clubs</h1>
        <p className="dashboard-subtitle">Explore and join student organizations</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="dashboard-grid">
        {clubs.map((club) => (
          <div key={club._id} className="stat-card">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-bold">{club.name}</h2>
               <span className="badge badge-warning">{club.category}</span>
            </div>
            <p className="text-gray-500 mb-4 flex-grow">{club.description}</p>
            {getClubButton(club)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clubs;
