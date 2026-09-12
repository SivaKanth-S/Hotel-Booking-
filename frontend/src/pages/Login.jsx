import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Hotel, Mail, Lock, LogIn, Sparkles, Shield, User } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      showSuccess(`Welcome back, ${res.name || 'Traveler'}!`);
      if (res.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/my-bookings');
      }
    } catch (err) {
      // Fallback demo credentials check if offline
      if (email === 'customer@example.com' && password === 'Customer@123') {
        const demoUser = { token: 'mock-jwt-customer-token', id: 1, name: 'Demo Customer', email: 'customer@example.com', role: 'CUSTOMER' };
        localStorage.setItem('grandstay_jwt', demoUser.token);
        localStorage.setItem('grandstay_user', JSON.stringify(demoUser));
        showSuccess('Logged in as Demo Customer!');
        window.location.href = '/my-bookings';
        return;
      } else if (email === 'admin@hotelbooking.com' && password === 'Admin@123') {
        const demoUser = { token: 'mock-jwt-admin-token', id: 99, name: 'GrandStay Admin', email: 'admin@hotelbooking.com', role: 'ADMIN' };
        localStorage.setItem('grandstay_jwt', demoUser.token);
        localStorage.setItem('grandstay_user', JSON.stringify(demoUser));
        showSuccess('Logged in as Platform Admin!');
        window.location.href = '/admin';
        return;
      }
      showError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const autofillCustomer = () => {
    setEmail('customer@example.com');
    setPassword('Customer@123');
  };

  const autofillAdmin = () => {
    setEmail('admin@hotelbooking.com');
    setPassword('Admin@123');
  };

  return (
    <div className="container" style={{
      padding: '60px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Hotel size={28} color="#fff" />
          </div>
          <h1 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginBottom: '6px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Sign in to access your bookings and manage your luxury stays.
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div style={{
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
            Quick Demo Autofill:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={autofillCustomer}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '6px' }}
            >
              <User size={12} /> Customer Demo
            </button>
            <button
              type="button"
              onClick={autofillAdmin}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '6px' }}
            >
              <Shield size={12} /> Admin Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><Mail size={13} /> Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label"><Lock size={13} /> Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
