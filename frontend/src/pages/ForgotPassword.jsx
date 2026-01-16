import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/request-reset', { email });
            setMessage(data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
            setMessage('');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Forgot Password</h2>
                <p style={{marginBottom: '1rem', color: '#666'}}>Enter your email to receive a reset link.</p>
                {message && <div style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
                {error && <div className="auth-error">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full-width">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
