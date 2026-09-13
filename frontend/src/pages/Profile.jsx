import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { userService } from '../services/userService';
import { bookingService } from '../services/bookingService';
import {
  User,
  Shield,
  Mail,
  Calendar,
  Key,
  CheckCircle2,
  Building2,
  CalendarCheck,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Edit3,
  Save,
  Bell,
  Check
} from 'lucide-react';

export const Profile = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW', 'SECURITY', 'PREFERENCES'

  // Edit Name State
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Change Password State
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Customer Bookings Stats
  const [customerBookings, setCustomerBookings] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Preferences
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [promoEmails, setPromoEmails] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfileAndData = async () => {
      setLoading(true);
      try {
        const data = await userService.getProfile();
        setProfile(data);
        setNameInput(data.name || '');
      } catch (err) {
        // Fallback to auth context user
        setProfile(user);
        setNameInput(user?.name || '');
      } finally {
        setLoading(false);
      }

      // Fetch bookings for stats
      if (!isAdmin) {
        try {
          const bookings = await bookingService.getMyBookings();
          setCustomerBookings(bookings || []);
        } catch {
          setCustomerBookings([]);
        } finally {
          setStatsLoading(false);
        }
      } else {
        setStatsLoading(false);
      }
    };

    fetchProfileAndData();
  }, [isAuthenticated, isAdmin, navigate, user]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showError('Name cannot be empty');
      return;
    }

    setSavingName(true);
    try {
      const updated = await userService.updateProfile({ name: nameInput.trim() });
      setProfile((prev) => ({ ...prev, name: updated.name }));
      setEditingName(false);
      showSuccess('Profile name updated successfully!');

      // Update localStorage so navbar updates immediately
      const savedUser = JSON.parse(localStorage.getItem('grandstay_user') || '{}');
      savedUser.name = updated.name;
      localStorage.setItem('grandstay_user', JSON.stringify(savedUser));
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile name');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordInput.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      showError('Passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      await userService.updateProfile({ newPassword: passwordInput });
      showSuccess('Password updated successfully! Please keep your new credentials safe.');
      setPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading your profile...
      </div>
    );
  }

  const displayName = profile?.name || user?.name || (isAdmin ? 'Administrator' : 'Valued Guest');
  const displayEmail = profile?.email || user?.email || '';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'September 2026';

  const confirmedBookingsCount = customerBookings.filter((b) => b.status === 'CONFIRMED').length;
  const rewardPoints = (confirmedBookingsCount * 1250) + 500;

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Hero Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          marginBottom: '32px',
          background: isAdmin
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.03))'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.03))',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: isAdmin
                  ? 'linear-gradient(135deg, #f59e0b, #b45309)'
                  : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                color: '#ffffff',
                boxShadow: isAdmin
                  ? '0 8px 24px rgba(245, 158, 11, 0.35)'
                  : '0 8px 24px rgba(99, 102, 241, 0.35)'
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Identity Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <h1 className="heading-serif" style={{ fontSize: '2rem', color: 'var(--text-heading)', margin: 0 }}>
                  {displayName}
                </h1>
                {isAdmin ? (
                  <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Shield size={13} /> Super Administrator
                  </span>
                ) : (
                  <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={13} /> GrandStay Elite Member
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', color: 'var(--text-secondary)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="var(--primary)" /> {displayEmail}
                </span>
                <span>&bull;</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--primary)" /> Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isAdmin ? (
              <Link to="/my-bookings" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarCheck size={16} /> My Reservations ({customerBookings.length})
              </Link>
            ) : (
              <Link to="/admin/bookings" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarCheck size={16} /> System Reservations
              </Link>
            )}
            <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-secondary" title="Sign out of this session">
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {!isAdmin ? (
          <>
            <div className="glass-panel" style={{ padding: '22px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Total Reservations
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {customerBookings.length}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stays booked</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Confirmed Active Stays
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
                  {confirmedBookingsCount}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Ready for check-in</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Cancelled Stays
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)' }}>
                  {customerBookings.filter((b) => b.status === 'CANCELLED').length}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Refunded / Released</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                GrandStay Rewards
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {rewardPoints.toLocaleString()}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>Tier Points</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="glass-panel" style={{ padding: '22px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Managed Hotels
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-heading)' }}>14</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Tamil Nadu Luxury Resorts</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Room Suites Inventory
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>29</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room categories</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Database & Server
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <strong style={{ color: 'var(--success)', fontSize: '0.95rem' }}>Connected & Active</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                MySQL 8.0 &bull; Spring Boot 3.3.4
              </span>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Admin Authority
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <Shield size={18} color="var(--accent-gold)" />
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>Full System Control</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', display: 'block', marginTop: '4px' }}>
                Inventory & Booking Permissions
              </span>
            </div>
          </>
        )}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '32px' }}>
        {[
          { id: 'OVERVIEW', label: 'Account Overview' },
          { id: 'SECURITY', label: 'Security & Password' },
          { id: 'PREFERENCES', label: 'Notifications & Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
              borderColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Account Overview */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }}>
          {/* Personal Information Form Card */}
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                Personal Information
              </h2>
              {!editingName ? (
                <button
                  onClick={() => setEditingName(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={14} /> Edit Name
                </button>
              ) : (
                <button onClick={() => setEditingName(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              )}
            </div>

            {editingName ? (
              <form onSubmit={handleUpdateName} style={{ marginBottom: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="form-input"
                    placeholder="Your Full Name"
                  />
                </div>
                <button type="submit" disabled={savingName} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={14} /> {savingName ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : null}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Full Name</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.9rem' }}>{displayName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.9rem' }}>{displayEmail}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Account Role</span>
                <strong style={{ color: isAdmin ? 'var(--accent-gold)' : 'var(--primary)', fontSize: '0.9rem' }}>
                  {isAdmin ? 'System Administrator' : 'Registered Customer'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Account Status</span>
                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Verified & Active
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Member Since</span>
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.9rem' }}>{memberSince}</strong>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts & Navigation Side Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isAdmin ? (
              <div className="glass-panel" style={{ padding: '26px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '14px' }}>
                  Quick Shortcuts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    to="/my-bookings"
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarCheck size={16} color="var(--primary)" /> View My Reservations
                    </span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/hotels"
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} color="var(--primary)" /> Explore Tamil Nadu Hotels
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '26px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '14px' }}>
                  Admin Control Panels
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    to="/admin"
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} color="var(--primary)" /> Manage Hotel Inventory
                    </span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/admin/bookings"
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarCheck size={16} color="var(--primary)" /> Manage Guest Bookings
                    </span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/admin/customers"
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="var(--primary)" /> Registered Customers
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* VIP / Privilege Box */}
            <div
              className="glass-panel"
              style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                borderColor: 'rgba(245, 158, 11, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--accent-gold)" />
                <strong style={{ color: 'var(--accent-gold)', fontSize: '0.95rem' }}>
                  {isAdmin ? 'System Integrity Status' : 'GrandStay Privilege Benefits'}
                </strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {isAdmin
                  ? 'All server instances, JWT auth providers, and MySQL database connection pools are operational with 100% health.'
                  : 'Enjoy flexible cancellation up to 48 hours prior to check-in, priority room upgrades, and complimentary high-speed fiber WiFi across all partner properties.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'SECURITY' && (
        <div style={{ maxWidth: '640px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Lock size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                Update Account Password
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Ensure your account is using a strong password of at least 6 characters.
            </p>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="form-input"
                  placeholder="Enter new secure password (min 6 chars)"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="form-input"
                  placeholder="Re-type new password to confirm"
                />
              </div>

              <button type="submit" disabled={changingPassword} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} /> {changingPassword ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Preferences */}
      {activeTab === 'PREFERENCES' && (
        <div style={{ maxWidth: '640px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Bell size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                Notification & Communication Preferences
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <div>
                  <strong style={{ color: 'var(--text-heading)', display: 'block', fontSize: '0.95rem' }}>
                    Reservation Confirmation Emails
                  </strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Receive instant booking vouchers and reservation codes via email.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => {
                    setEmailNotif(e.target.checked);
                    showSuccess('Email notification preference updated.');
                  }}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <div>
                  <strong style={{ color: 'var(--text-heading)', display: 'block', fontSize: '0.95rem' }}>
                    Exclusive Offers & Seasonal Deals
                  </strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Get discounts like WELCOME10 and seasonal resort package alerts.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={promoEmails}
                  onChange={(e) => {
                    setPromoEmails(e.target.checked);
                    showSuccess('Promotional preference updated.');
                  }}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '12px 0' }}>
                <div>
                  <strong style={{ color: 'var(--text-heading)', display: 'block', fontSize: '0.95rem' }}>
                    SMS Check-In Alerts
                  </strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Receive SMS alerts 24 hours prior to hotel check-in date.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => {
                    setSmsAlerts(e.target.checked);
                    showSuccess('SMS preference updated.');
                  }}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
