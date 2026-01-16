import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import '../styles/auth.css';

const InstitutionSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/institutions/register', formData);
            alert('Institution registered successfully! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <Link to="/register" className="auth-link mb-4 block" style={{ textAlign: 'left', textDecoration: 'none' }}>
                    &larr; Back
                </Link>
                <h2 className="auth-title">Register Institution</h2>
                {error && <div className="auth-error">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Institution Name</label>
                        <input name="name" className="input" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Institution Code (e.g., mit)</label>
                        <input name="code" className="input" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Admin Name</label>
                        <input name="adminName" className="input" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Admin Email</label>
                        <input name="adminEmail" type="email" className="input" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Admin Password</label>
                        <input name="adminPassword" type="password" className="input" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full-width">Register Institution</button>
                </form>
            </div>
        </div>
    );
};

export default InstitutionSignup;
