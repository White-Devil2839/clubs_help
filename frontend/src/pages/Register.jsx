import React, { useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';

import '../styles/auth.css';

const Register = () => {
  const { institutionCode } = useParams();
  const navigate = useNavigate();
  const { loginSuccess } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
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
        const { data } = await api.post(`/${institutionCode}/auth/register`, formData);
        
        if (data.success) {
            loginSuccess(data);
             if (data.redirect) {
                navigate(data.redirect);
            } else {
                 navigate(`/${institutionCode}/dashboard`);
            }
        } else {
             setError('Registration failed');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="text-center text-gray-500 mb-6 font-medium">Join {institutionCode}</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
          <Button type="submit" className="btn-full-width">Register</Button>


        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to={`/${institutionCode}/login`} className="auth-link">Login here</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
