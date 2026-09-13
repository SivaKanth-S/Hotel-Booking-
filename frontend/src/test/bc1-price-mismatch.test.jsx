/**
 * Bug Condition 1 — Price Mismatch / Double Tax
 *
 * Expected (fixed) behavior : finalTotal = basePrice - discountAmount (no 12% tax)
 * Unfixed behavior           : finalTotal = basePrice + taxesAndFees (12%) - discountAmount
 *
 * For pricePerNight=5000, nights=3, no promo:
 *   basePrice     = 15,000
 *   Unfixed total = 16,800  (15000 + 1800)
 *   Fixed total   = 15,000
 *
 * EXPECTED OUTCOME on unfixed code: FAILS
 * Counterexample: "finalTotal=16800 ≠ backendTotal=15000 for pricePerNight=5000 × 3 nights"
 *
 * Validates: Requirements 1.1, 1.2
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// ── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(), post: vi.fn(), put: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

vi.mock('../services/authService', () => ({
  authService: { getCurrentUser: vi.fn().mockReturnValue(null), login: vi.fn(), logout: vi.fn() },
}));

vi.mock('../services/bookingService', () => ({
  bookingService: { createBooking: vi.fn(), cancelBooking: vi.fn(), getMyBookings: vi.fn() },
}));

vi.mock('../services/promotionService', () => ({
  promotionService: { validatePromo: vi.fn().mockResolvedValue({ valid: false }) },
}));

vi.mock('../context/NotificationContext', () => ({
  useNotification: () => ({ showError: vi.fn(), showSuccess: vi.fn(), showInfo: vi.fn() }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test', email: 'test@test.com', role: 'USER' },
    isAuthenticated: true,
    isAdmin: false,
  }),
}));

import { BookingModal } from '../components/BookingModal';

// ── Test data ─────────────────────────────────────────────────────────────────

const hotel = { id: 1, name: 'Test Hotel', city: 'Chennai' };
const room  = { id: 10, category: 'Deluxe Suite', pricePerNight: 5000, capacity: 4 };

// checkIn = tomorrow, checkOut = tomorrow+3  → exactly 3 nights
const tomorrow   = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
const threeNights = new Date(); threeNights.setDate(threeNights.getDate() + 4);
const checkIn    = tomorrow.toISOString().split('T')[0];
const checkOut   = threeNights.toISOString().split('T')[0];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Bug Condition 1 — Price Mismatch / Double Tax', () => {
  it('displays finalTotal equal to basePrice only (no 12% tax), matching backend totalPrice', () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={vi.fn()}
        hotel={hotel}
        room={room}
        initialDates={{ checkIn, checkOut }}
      />
    );

    // The backend total = pricePerNight × nights = 5000 × 3 = 15,000 (no tax)
    // The confirm button text on unfixed code shows: "Confirm & Book Now (₹16,800)"
    // On fixed code it must show: "Confirm & Book Now (₹15,000)"

    const confirmBtn = screen.getByRole('button', { name: /Confirm & Book Now/i });

    // Must NOT include the buggy tax-inclusive total (₹16,800)
    expect(confirmBtn.textContent).not.toContain('16,800');

    // Must include the correct tax-exclusive total (₹15,000)
    expect(confirmBtn.textContent).toContain('15,000');

    // The "Estimated Taxes & Fees" row must NOT be present
    expect(screen.queryByText(/Estimated Taxes & Fees/i)).not.toBeInTheDocument();
  });
});
