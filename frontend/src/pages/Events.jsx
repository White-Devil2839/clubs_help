import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

import '../styles/dashboard.css';

const Events = () => {
  const { institutionCode } = useParams();
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEvents();
  }, [institutionCode, page]);

  const fetchEvents = async () => {
    try {
      const res = await api.get(`/${institutionCode}/events?page=${page}&limit=6`);
      if (res.data.events) {
        setEvents(res.data.events);
        setTotalPages(res.data.totalPages);
      } else {
        setEvents(res.data);
      }
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/${institutionCode}/events/${eventId}/register`);
      setMessage({ type: 'success', text: 'Successfully registered for event!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error registering for event' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="section-container">
         <h1 className="dashboard-title">Events</h1>
         <p className="dashboard-subtitle">Discover upcoming events and activities.</p>
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
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="stat-card">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <span className={`badge ${event.type === 'INSTITUTE' ? 'badge-success' : 'badge-warning'}`}>
                  {event.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(event.date).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mb-2">Location: {event.location}</p>
              {event.capacity && (
                <p className="text-sm text-gray-500 mb-2">
                  Spots Left: <span className={event.spotsLeft > 0 ? 'text-green-600' : 'text-red-500'}>{event.spotsLeft}</span> / {event.capacity}
                </p>
              )}
              <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>
              <Button onClick={() => handleRegister(event._id)} disabled={event.spotsLeft === 0} className="w-full">
                {event.spotsLeft === 0 ? 'Full' : 'Register'}
              </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No events found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className="disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="flex items-center text-gray-600">Page {page} of {totalPages}</span>
          <Button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page >= totalPages}
            className="disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Events;
