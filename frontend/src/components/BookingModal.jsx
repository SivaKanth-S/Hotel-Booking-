import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { bookingService } from '../services/bookingService';
import { promotionService } from '../services/promotionService';
import { X, Calendar, Users, Tag, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

const formatLocalDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const BookingModal = ({ isOpen, onClose, hotel, room, initialDates = {} }) => {
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState(initialDates.checkIn || '');
  const [checkOutDate, setCheckOutDate] = useState(initialDates.checkOut || '');
  const [numGuests, setNumGuests] = useState(2);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(null); // { discountType, discountValue }
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync initial dates and reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setConfirmedBooking(null);
      setCopied(false);
      setPromoDiscount(null);
      setPromoCode('');

      if (initialDates.checkIn && initialDates.checkOut) {
        setCheckInDate(initialDates.checkIn);
        setCheckOutDate(initialDates.checkOut);
      } else if (!checkInDate || !checkOutDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 4);

        setCheckInDate(formatLocalDate(tomorrow));
        setCheckOutDate(formatLocalDate(dayAfter));
      }
    }
  }, [isOpen, room?.id, initialDates.checkIn, initialDates.checkOut]);

  if (!isOpen || !room) return null;

  // Calculate nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const basePrice = (room.pricePerNight || 200) * nights;
  const taxesAndFees = Math.round(basePrice * 0.12);

  let discountAmount = 0;
  if (promoDiscount) {
    if (promoDiscount.discountType === 'PERCENTAGE') {
      discountAmount = Math.round(basePrice * (promoDiscount.discountValue / 100));
    } else {
      discountAmount = promoDiscount.discountValue;
    }
  }

  const finalTotal = Math.max(0, basePrice + taxesAndFees - discountAmount);

  // Validate Promo Code
  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setValidatingPromo(true);
    try {
      const result = await promotionService.validatePromo(promoCode.trim().toUpperCase());
      if (result.valid) {
        setPromoDiscount(result);
        showSuccess(`Promo "${promoCode.toUpperCase()}" applied! You saved ${result.discountType === 'PERCENTAGE' ? `${result.discountValue}%` : `₹${result.discountValue}`}`);
      } else {
        setPromoDiscount(null);
        showError(result.message || 'Invalid promotion code');
      }
    } catch (err) {
      // Fallback local promo validation if mock mode
      if (promoCode.trim().toUpperCase() === 'WELCOME10') {
        setPromoDiscount({ valid: true, discountType: 'PERCENTAGE', discountValue: 10, code: 'WELCOME10' });
        showSuccess('Promo "WELCOME10" applied! (10% discount)');
      } else if (promoCode.trim().toUpperCase() === 'SUMMER25') {
        setPromoDiscount({ valid: true, discountType: 'PERCENTAGE', discountValue: 25, code: 'SUMMER25' });
        showSuccess('Promo "SUMMER25" applied! (25% discount)');
      } else {
        showError('Invalid or expired promo code');
      }
    } finally {
      setValidatingPromo(false);
    }
  };

  // Submit Booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showError('Please sign in or create an account to book your stay.');
      navigate('/login');
      return;
    }

    const todayStr = formatLocalDate(new Date());
    if (checkInDate < todayStr) {
      showError('Check-in date must be today or a future date');
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      showError('Check-out date must be after check-in date');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        roomId: room.id,
        checkInDate,
        checkOutDate,
        numGuests: Number(numGuests),
        promotionCode: promoDiscount ? promoDiscount.code || promoCode.trim().toUpperCase() : null
      };

      const response = await bookingService.createBooking(payload);
      setConfirmedBooking(response);
      showSuccess('Reservation confirmed successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to complete booking. Rooms may be sold out for selected dates.';
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const copyReservationCode = () => {
    if (confirmedBooking?.reservationNumber) {
      navigator.clipboard.writeText(confirmedBooking.reservationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {confirmedBooking ? (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} color="var(--success)" />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
              Reservation Confirmed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your stay at <strong style={{ color: 'var(--text-heading)' }}>{hotel?.name || 'GrandStay Resort'}</strong> has been booked and guaranteed.
            </p>

            {/* Reservation Card */}
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px dashed var(--border-glass-hover)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '28px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reservation Number:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                    {confirmedBooking.reservationNumber}
                  </span>
                  <button
                    onClick={copyReservationCode}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px' }}
                    title="Copy code"
                  >
                    {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Room Category</span>
                  <strong style={{ color: 'var(--text-heading)' }}>{room.category}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Guests</span>
                  <strong style={{ color: 'var(--text-heading)' }}>{numGuests} Guests</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Dates</span>
                  <strong style={{ color: 'var(--text-heading)' }}>{checkInDate} &rarr; {checkOutDate} ({nights} nights)</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Total Paid</span>
                  <strong style={{ color: 'var(--success)' }}>₹{Number(confirmedBooking.totalPrice || finalTotal).toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  onClose();
                  navigate('/my-bookings');
                }}
                className="btn btn-primary"
              >
                Go to My Bookings
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Booking Form */
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Secure Checkout</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                Book {room.category}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {hotel?.name} &bull; ₹{Number(room.pricePerNight).toLocaleString('en-IN')} per night
              </p>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label"><Calendar size={13} /> Check-In</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label"><Calendar size={13} /> Check-Out</label>
                  <input
                    type="date"
                    required
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label"><Users size={13} /> Number of Guests</label>
                <select
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number(e.target.value))}
                  className="form-select"
                >
                  {Array.from({ length: room.capacity || 4 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Promo Code Input */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label"><Tag size={13} /> Promotion / Discount Code</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Try WELCOME10 or SUMMER25"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="form-input"
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={validatingPromo || !promoCode.trim()}
                    className="btn btn-secondary btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {validatingPromo ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {promoDiscount && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px', display: 'block' }}>
                    &check; Promo code applied successfully!
                  </span>
                )}
              </div>

              {/* Pricing Breakdown Card */}
              <div style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  <span>₹{Number(room.pricePerNight).toLocaleString('en-IN')} &times; {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>₹{Number(basePrice).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  <span>Estimated Taxes & Fees (12%)</span>
                  <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>₹{Number(taxesAndFees).toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--success)' }}>
                    <span>Promotion Discount</span>
                    <span>-₹{Number(discountAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={{
                  borderTop: '1px solid var(--border-glass)',
                  paddingTop: '10px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Total Amount</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{Number(finalTotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {submitting ? 'Reserving...' : `Confirm & Book Now (₹${Number(finalTotal).toLocaleString('en-IN')})`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={14} color="var(--success)" />
                <span>Instant Confirmation &bull; Concurrency Protected &bull; Flexible Cancellation</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
