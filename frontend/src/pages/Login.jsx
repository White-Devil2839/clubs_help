import React, { useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';

import '../styles/auth.css';

const Login = () => {
  const { institutionCode } = useParams();
  const navigate = useNavigate();
  const { loginSuccess } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const { data } = await api.post(`/${institutionCode}/auth/login`, formData);
        
        if (data.success) {
            loginSuccess(data);
            if (data.redirect) {
                navigate(data.redirect);
            } else {
                 navigate(`/${institutionCode}/dashboard`);
            }
        } else {
             setError('Login failed');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Link to="/" className="auth-link mb-4 block" style={{ textAlign: 'left', textDecoration: 'none' }}>
            &larr; Back
        </Link>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6 font-medium">Login to {institutionCode}</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="btn-full-width">Login</Button>
          

        </form>
        
        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link text-sm mb-2 block">Forgot Password?</Link>
          <p>Don't have an account? <Link to={`/${institutionCode}/register`} className="auth-link">Register here</Link></p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
