import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Shield, Mail, Lock, KeyRound, ArrowLeft, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const AdminLogin = () => {
  const { login, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);

      // Verify that the user has ADMIN role
      if (res.role !== 'ADMIN') {
        logout();
        showError('Access Denied: This portal requires administrator privileges.');
        return;
      }

      showSuccess(`Welcome Administrator, ${res.name || 'Admin'}!`);
      navigate('/admin');
    } catch (err) {
      showError(err.response?.data?.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
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
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle top indicator bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #6366f1, #ec4899, #8b5cf6)'
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)'
          }}>
            <Shield size={30} color="#ffffff" />
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '3px 10px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--primary)',
            marginBottom: '10px'
          }}>
            <KeyRound size={12} /> Management Portal
          </span>
          <h1 className="heading-serif" style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginBottom: '6px' }}>
            Administrator Login
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Enter your administrative credentials to manage hotels, rooms, and guest reservations.
          </p>
        </div>

        {/* Security Alert Badge */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Restricted area. Authorized personnel only. All access attempts are logged.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><Mail size={13} /> Admin Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label"><Lock size={13} /> Admin Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingRight: '42px' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-heading)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              marginBottom: '18px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              boxShadow: '0 4px 16px rgba(79, 70, 229, 0.35)'
            }}
          >
            {loading ? 'Verifying Admin Privileges...' : 'Sign In as Administrator'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '16px'
        }}>
          <Link to="/login" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ArrowLeft size={13} /> Customer Login
          </Link>
          <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
