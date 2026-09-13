import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { userService } from '../services/userService';
import { bookingService } from '../services/bookingService';

import { Shield, Users, Mail, User, Calendar, DollarSign, Search, X, CalendarCheck, CheckCircle2, Clock, Phone, ArrowRight, Bed } from 'lucide-react';

export const AdminCustomers = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, bookingsData] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        bookingService.getAllBookingsAdmin().catch(() => [])
      ]);
      setCustomers(usersData || []);
      setBookings(bookingsData || []);
    } catch (err) {
      // Fallback data
      setCustomers([
        { id: 1, name: "Alice Smith", email: "alice@example.com", role: "CUSTOMER", createdAt: "2026-09-01T10:00:00" },
        { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "CUSTOMER", createdAt: "2026-09-05T14:30:00" },
        { id: 3, name: "Test Customer", email: "customer@example.com", role: "CUSTOMER", createdAt: "2026-09-10T12:00:00" },
        { id: 4, name: "Administrator", email: "admin@gmail.com", role: "ADMIN", createdAt: "2026-08-15T09:00:00" }
      ]);
      setBookings([
        {
          id: 101,
          reservationNumber: "RES-202609-TN8K21",
          userId: 1,
          userName: "Alice Smith",
          userEmail: "alice@example.com",
          numGuests: 2,
          hotelName: "The Grand Chola Palace",
          hotelCity: "Chennai",
          roomCategory: "Chola Heritage Suite",
          checkInDate: "2026-10-15",
          checkOutDate: "2026-10-18",
          totalPrice: 25500,
          status: "CONFIRMED"
        },
        {
          id: 102,
          reservationNumber: "RES-202608-TN2L89",
          userId: 2,
          userName: "Bob Johnson",
          userEmail: "bob@example.com",
          numGuests: 2,
          hotelName: "Meenakshi Heritage Grand",
          hotelCity: "Madurai",
          roomCategory: "Temple View Heritage Room",
          checkInDate: "2026-08-01",
          checkOutDate: "2026-08-05",
          totalPrice: 14000,
          status: "CONFIRMED"
        },
        {
          id: 103,
          reservationNumber: "RES-202609-TN4P12",
          userId: 3,
          userName: "Test Customer",
          userEmail: "customer@example.com",
          numGuests: 1,
          hotelName: "Heritage Haveli",
          hotelCity: "Jaipur",
          roomCategory: "Royal Suite",
          checkInDate: "2026-11-01",
          checkOutDate: "2026-11-04",
          totalPrice: 45000,
          status: "CONFIRMED"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin]);

  // Calculate metrics
  const getCustomerBookings = (customer) => {
    if (!customer) return [];
    return bookings.filter(b => b.userId === customer.id || b.userEmail?.toLowerCase() === customer.email?.toLowerCase());
  };

  const getCustomerSpend = (customer) => {
    const custBookings = getCustomerBookings(customer);
    return custBookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  };

  const filteredCustomers = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.role || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="badge badge-primary"><Shield size={13} /> Admin Console</span>
        </div>
        <h1 className="heading-serif" style={{ fontSize: '2.4rem', color: 'var(--text-heading)' }}>
          Customer & Guest Directory
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          View registered customer accounts, contact details, and complete hotel reservation histories.
        </p>
      </div>


      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="var(--primary)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Registered Guests</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)' }}>{customers.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarCheck size={24} color="var(--success)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Bookings Placed</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)' }}>{bookings.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="var(--accent-gold)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Customer Spend</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
              ₹{bookings.filter(b => b.status === 'CONFIRMED').reduce((s, b) => s + (b.totalPrice || 0), 0).toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '420px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Search by customer name, email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px' }}>Customer ID</th>
              <th style={{ padding: '16px' }}>Customer Name</th>
              <th style={{ padding: '16px' }}>Email Address</th>
              <th style={{ padding: '16px' }}>Account Role</th>
              <th style={{ padding: '16px' }}>Total Bookings</th>
              <th style={{ padding: '16px' }}>Total Spend</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No customer records found matching "{search}".
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                const custBookings = getCustomerBookings(cust);
                const custSpend = getCustomerSpend(cust);

                return (
                  <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      #{cust.id}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: cust.role === 'ADMIN' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          {(cust.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.92rem' }}>
                            {cust.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified User'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} color="var(--primary)" />
                        <span>{cust.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${cust.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`} style={{ fontSize: '0.75rem' }}>
                        {cust.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-heading)' }}>
                      {custBookings.length} {custBookings.length === 1 ? 'Stay' : 'Stays'}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--success)' }}>
                      ₹{custSpend.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                      >
                        <User size={13} /> View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content" style={{ maxWidth: '780px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.2rem'
                }}>
                  {(selectedCustomer.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--text-heading)', fontWeight: 700, margin: 0 }}>
                    {selectedCustomer.name}
                  </h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={12} /> {selectedCustomer.email} &bull; Account #{selectedCustomer.id} &bull; <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>{selectedCustomer.role}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Customer Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--bg-glass)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Total Bookings</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {getCustomerBookings(selectedCustomer).length}
                </span>
              </div>

              <div style={{ background: 'var(--bg-glass)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Confirmed Bookings</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>
                  {getCustomerBookings(selectedCustomer).filter(b => b.status === 'CONFIRMED').length}
                </span>
              </div>

              <div style={{ background: 'var(--bg-glass)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Lifetime Spend</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>
                  ₹{getCustomerSpend(selectedCustomer).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Customer Bookings History */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bed size={16} color="var(--primary)" /> Reservation History for {selectedCustomer.name}
              </h3>

              {getCustomerBookings(selectedCustomer).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                  This customer has not made any hotel bookings yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '12px' }}>Reservation #</th>
                        <th style={{ padding: '12px' }}>Hotel & Room</th>
                        <th style={{ padding: '12px' }}>Dates</th>
                        <th style={{ padding: '12px' }}>Total Price</th>
                        <th style={{ padding: '12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCustomerBookings(selectedCustomer).map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                            {b.reservationNumber}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{b.hotelName}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.roomCategory}</div>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                            {b.checkInDate} &rarr; {b.checkOutDate}
                          </td>
                          <td style={{ padding: '12px', fontWeight: 700, color: 'var(--success)' }}>
                            ₹{Number(b.totalPrice).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button onClick={() => setSelectedCustomer(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
