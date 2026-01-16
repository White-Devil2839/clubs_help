import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import '../styles/admin.css'; // Reuse admin styles or create institution.css
import '../styles/dashboard.css'; // For badge styles

const Institution = () => {
    const { institutionCode } = useParams();
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        sort: 'latest'
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUsers();
    }, [institutionCode, filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const { data } = await api.get(`/${institutionCode}/admin/users?${queryParams}`);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(institutionCode);
        setMessage({ type: 'success', text: 'Institution code copied to clipboard!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    return (
        <div className="dashboard-container">
             <div className="section-container">
                <h1 className="dashboard-title">Institution Management</h1>
                <p className="dashboard-subtitle">Manage users and view institution details.</p>
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

            {/* Institution Code Card */}
            <Card className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold mb-1">Institution Code</h3>
                        <p className="text-gray-500 text-sm">Share this code with students to let them join.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <code className="bg-gray-100 px-4 py-2 rounded text-lg font-mono font-bold text-primary">
                            {institutionCode}
                        </code>
                        <Button onClick={handleCopyCode} variant="outline" size="sm">
                            Copy
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name or email..."
                    className="input max-w-xs"
                    value={filters.search}
                    onChange={handleFilterChange}
                />
                
                <select 
                    name="role" 
                    className="input max-w-xs" 
                    value={filters.role} 
                    onChange={handleFilterChange}
                >
                    <option value="">All Roles</option>
                    <option value="MEMBER">Student</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <select 
                    name="sort" 
                    className="input max-w-xs" 
                    value={filters.sort} 
                    onChange={handleFilterChange}
                >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            {/* Users List */}
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">User</th>
                                <th className="p-4 font-semibold text-gray-600">Role</th>
                                <th className="p-4 font-semibold text-gray-600">Joined</th>
                                <th className="p-4 font-semibold text-gray-600">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">No users found matching filters.</td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{u.name}</td>
                                        <td className="p-4">
                                            <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`}>
                                                {u.role === 'MEMBER' ? 'Student' : u.role === 'ADMIN' ? 'Admin' : u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-gray-500">{u.email}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Institution;
