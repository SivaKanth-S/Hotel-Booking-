import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Hotel, User, LogOut, Shield, Calendar, Search, Sun, Moon, Menu, X, Building2, CalendarCheck, Users } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'var(--bg-glass-nav)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Hotel size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-heading)' }}>
              GRAND<span style={{ color: 'var(--primary)' }}>STAY</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Luxury Hotels & Resorts
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }} className="desktop-nav">
          {!isAdmin && (
            <>
              <Link
                to="/"
                style={{ color: 'var(--text-secondary)', fontWeight: 500, transition: '0.2s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-heading)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                Home
              </Link>
              <Link
                to="/hotels"
                style={{ color: 'var(--text-secondary)', fontWeight: 500, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-heading)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                <Search size={16} /> Explore Hotels
              </Link>

              {isAuthenticated && (
                <Link
                  to="/my-bookings"
                  style={{ color: 'var(--text-secondary)', fontWeight: 500, transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-heading)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  <Calendar size={16} /> My Bookings
                </Link>
              )}
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin" style={{
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                <Building2 size={16} /> Hotels
              </Link>

              <Link to="/admin/bookings" style={{
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                <CalendarCheck size={16} /> Hotel Bookings
              </Link>

              <Link to="/admin/customers" style={{
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                <Users size={16} /> Customers
              </Link>

              <Link to="/admin" style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--border-glass-hover)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Shield size={15} /> Admin Portal
              </Link>
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <>
                <Sun size={17} color="#fbbf24" className="theme-icon" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={17} color="#4f46e5" className="theme-icon" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* User Auth / Account Buttons */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px' }}>
              <Link
                to="/profile"
                id="account-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '5px 14px',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-glass)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = 'var(--primary-light)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                  e.currentTarget.style.background = 'var(--bg-glass)';
                  e.currentTarget.style.transform = 'none';
                }}
                title="View Account Profile & Settings"
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: isAdmin
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : (isAdmin ? 'A' : 'U')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {user?.name || (isAdmin ? 'Administrator' : 'Guest')}
                    </span>
                    {isAdmin && (
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
                style={{ padding: '8px 10px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
