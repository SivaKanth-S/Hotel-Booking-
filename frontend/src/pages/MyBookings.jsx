import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { bookingService } from '../services/bookingService';
import { Calendar, MapPin, Tag, AlertCircle, CheckCircle2, XCircle, RotateCcw, Copy, Check, ArrowRight } from 'lucide-react';

export const MyBookings = () => {
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'CONFIRMED', 'CANCELLED'
  const [cancellingId, setCancellingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      // Fallback demo bookings
      setBookings([
        {
          id: 101,
          reservationNumber: "RES-202609-9X8K21",
          hotelName: "Grand Palace Hotel & Suites",
          hotelCity: "New York",
          roomCategory: "Deluxe Skyline Suite",
          checkInDate: "2026-10-15",
          checkOutDate: "2026-10-18",
          numGuests: 2,
          totalPrice: 840,
          status: "CONFIRMED",
          createdAt: "2026-09-11T12:00:00Z"
        },
        {
          id: 102,
          reservationNumber: "RES-202608-4M2L89",
          hotelName: "Azure Oceanfront Resort",
          hotelCity: "Miami",
          roomCategory: "Oceanfront Deluxe",
          checkInDate: "2026-08-01",
          checkOutDate: "2026-08-05",
          numGuests: 2,
          totalPrice: 1120,
          status: "CONFIRMED",
          createdAt: "2026-07-20T10:30:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? The dates will be released back to the room inventory.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      showSuccess('Reservation cancelled successfully. Room availability restored.');
      // Refresh
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  const copyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="heading-serif" style={{ fontSize: '2.4rem', color: 'var(--text-heading)', marginBottom: '8px' }}>
          My Reservations & History
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your upcoming luxury stays, retrieve reservation numbers, or cancel and rebook.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        {[
          { id: 'ALL', label: `All Bookings (${bookings.length})` },
          { id: 'CONFIRMED', label: `Confirmed (${bookings.filter(b => b.status === 'CONFIRMED').length})` },
          { id: 'CANCELLED', label: `Cancelled (${bookings.filter(b => b.status === 'CANCELLED').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
              borderColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              padding: '8px 16px',
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          Loading your reservations...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-heading)', marginBottom: '8px' }}>No reservations found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {activeTab === 'ALL'
              ? 'You haven\'t made any bookings yet. Start exploring luxury hotels!'
              : `No ${activeTab.toLowerCase()} bookings found.`}
          </p>
          <Link to="/hotels" className="btn btn-primary">
            Explore Hotels
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            const isConfirmed = booking.status === 'CONFIRMED';

            return (
              <div
                key={booking.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '24px',
                  alignItems: 'center',
                  borderLeft: isConfirmed ? '4px solid var(--success)' : (isCancelled ? '4px solid var(--danger)' : '4px solid var(--accent-gold)')
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {isConfirmed && <span className="badge badge-success"><CheckCircle2 size={12} /> Confirmed</span>}
                    {isCancelled && <span className="badge badge-danger"><XCircle size={12} /> Cancelled</span>}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Reservation Code:</span>
                      <strong style={{ color: 'var(--primary)', letterSpacing: '0.04em' }}>{booking.reservationNumber}</strong>
                      <button
                        onClick={() => copyCode(booking.id, booking.reservationNumber)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        title="Copy code"
                      >
                        {copiedId === booking.id ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px' }}>
                    {booking.hotelName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{booking.hotelCity || 'Destination'}</span>
                    <span>&bull;</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{booking.roomCategory}</strong>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Check-In Date</span>
                      <strong style={{ color: 'var(--text-heading)' }}>{booking.checkInDate}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Check-Out Date</span>
                      <strong style={{ color: 'var(--text-heading)' }}>{booking.checkOutDate}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Guests</span>
                      <strong style={{ color: 'var(--text-heading)' }}>{booking.numGuests || 2} Guests</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total Paid</span>
                      <strong style={{ color: 'var(--success)' }}>${booking.totalPrice}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '160px' }}>
                  {isConfirmed && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="btn btn-danger btn-sm"
                    >
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}

                  <Link to="/hotels" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <RotateCcw size={14} />
                    <span>Book Another</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
