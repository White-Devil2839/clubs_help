import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/dashboard.css';

const ClubDetails = () => {
    const { institutionCode, clubId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [club, setClub] = useState(null);
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [membership, setMembership] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchClubData();
    }, [clubId]);

    const fetchClubData = async () => {
        setLoading(true);
        try {
            const [clubRes, membersRes, eventsRes, membershipRes] = await Promise.all([
                api.get(`/${institutionCode}/clubs/${clubId}`),
                api.get(`/${institutionCode}/clubs/${clubId}/members`),
                api.get(`/${institutionCode}/clubs/${clubId}/events`),
                api.get(`/${institutionCode}/me/memberships`)
            ]);

            setClub(clubRes.data);
            setMembers(membersRes.data);
            setEvents(eventsRes.data);

            const myMembership = membershipRes.data.find(m => m.clubId._id === clubId);
            setMembership(myMembership);
        } catch (error) {
            console.error('Error fetching club data:', error);
            setMessage({ type: 'error', text: 'Failed to load club details' });
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            await api.post(`/${institutionCode}/clubs/${clubId}/join`);
            setMessage({ type: 'success', text: 'Join request sent! Waiting for admin approval.' });
            fetchClubData();
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Error joining club' 
            });
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="text-center py-12">Loading...</div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="dashboard-container">
                <div className="text-center py-12">Club not found</div>
            </div>
        );
    }

    const getMembershipButton = () => {
        if (!membership) {
            return (
                <Button onClick={handleJoin} className="w-full">
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
                    <div className="bg-green-50 border border-green-200 rounded p-3 text-green-700 text-center">
                        ✓ You are a member of this club
                    </div>
                );
            case 'REJECTED':
                return (
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-center mb-2">
                        Your request was rejected
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="section-container">
                <Button variant="outline" onClick={() => navigate(`/${institutionCode}/clubs`)} className="mb-4">
                    ← Back to Clubs
                </Button>
                <h1 className="dashboard-title">{club.name}</h1>
                <span className="badge badge-warning">{club.category}</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Club Info */}
                <div className="lg:col-span-2">
                    <Card className="mb-6">
                        <h2 className="text-xl font-bold mb-4">About</h2>
                        <p className="text-gray-600">{club.description}</p>
                    </Card>

                    {/* Events */}
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
                        {events.length === 0 ? (
                            <p className="text-gray-500">No upcoming events</p>
                        ) : (
                            <div className="space-y-3">
                                {events.map(event => (
                                    <div key={event._id} className="border-l-4 border-primary pl-4 py-2">
                                        <h3 className="font-semibold">{event.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(event.date).toLocaleDateString()} at {event.location}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div>
                    <Card className="mb-6">
                        <h2 className="text-xl font-bold mb-4">Join</h2>
                        {getMembershipButton()}
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold mb-4">Members ({members.length})</h2>
                        {members.length === 0 ? (
                            <p className="text-gray-500 text-sm">No members yet</p>
                        ) : (
                            <div className="space-y-2">
                                {members.slice(0, 10).map(member => (
                                    <div key={member._id} className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                                            {member.userId.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm">{member.userId.name}</span>
                                    </div>
                                ))}
                                {members.length > 10 && (
                                    <p className="text-sm text-gray-500">+{members.length - 10} more</p>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;
