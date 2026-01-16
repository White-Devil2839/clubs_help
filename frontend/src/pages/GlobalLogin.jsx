
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import '../styles/auth.css';
import api from '../utils/api'; // Ensure api utility is used

const GlobalLogin = () => {
    const { loginSuccess } = React.useContext(AuthContext);
    const [roleSelection, setRoleSelection] = useState(null); // 'student' or 'institution'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

// GoogleLogin logic removed

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://localhost:5008/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update Context
                loginSuccess(data);
                
                // Strict Requirement: Read redirect from response and navigate
                if (data.redirect) {
                    navigate(data.redirect);
                } else {
                    // Fallback
                     if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN') {
                         navigate(`/${data.institutionCode}/admin`);
                    } else {
                         navigate(`/${data.institutionCode}/dashboard`);
                    }
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    const resetSelection = () => {
        setRoleSelection(null);
        setError('');
        setEmail('');
        setPassword('');
    };

    if (!roleSelection) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Log in to CampusHub</h2>
                    <p className="auth-subtitle">
                        Select your account type to continue
                    </p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setRoleSelection('institution')}
                            className="btn btn-primary btn-full-width"
                        >
                            Institution Admin
                        </button>
                        <button
                            onClick={() => setRoleSelection('student')}
                            className="btn btn-secondary btn-full-width"
                        >
                            Student / Member
                        </button>
                    </div>
                     <div className="auth-footer">
                        <Link to="/" className="auth-link">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                 <button onClick={resetSelection} className="auth-link mb-4 block" style={{ textAlign: 'left' }}> 
                    &larr; Back
                 </button>
                
                <h2 className="auth-title">
                    {roleSelection === 'institution' ? 'Institution Login' : 'Student Login'}
                </h2>
                
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}
                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email" className="label">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full-width"
                    >
                        Sign in
                    </button>

                </form>
                <div className="auth-footer">
                    <Link to="/forgot-password" className="auth-link">
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GlobalLogin;
