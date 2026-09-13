/**
 * Bug Condition 3 — Cancel Desync on Success
 *
 * Expected (fixed) behavior : after a successful cancelBooking call,
 *   fetchBookings() (getMyBookings) is called again to re-sync from the server.
 * Unfixed behavior           : setBookings(prev => prev.map(...)) mutates local
 *   state; getMyBookings is called only once (on mount), never after cancel.
 *
 * EXPECTED OUTCOME on unfixed code: FAILS
 * Counterexample: "fetchBookings not called; local state mutated directly via setBookings.map"
 *
 * Validates: Requirements 1.6
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

const mockCancelBooking = vi.fn();
const mockGetMyBookings = vi.fn();

vi.mock('../services/bookingService', () => ({
  bookingService: {
    cancelBooking: (...args) => mockCancelBooking(...args),
    getMyBookings: (...args) => mockGetMyBookings(...args),
    createBooking: vi.fn(),
  },
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

import { MyBookings } from '../pages/MyBookings';

// ── Test data ─────────────────────────────────────────────────────────────────

const tomorrow    = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
const fourDaysOut = new Date(); fourDaysOut.setDate(fourDaysOut.getDate() + 4);
const checkIn     = tomorrow.toISOString().split('T')[0];
const checkOut    = fourDaysOut.toISOString().split('T')[0];

const confirmedBooking = {
  id: 42,
  reservationNumber: 'RES-TEST-001',
  hotelName: 'Test Hotel',
  hotelCity: 'Chennai',
  roomCategory: 'Deluxe Suite',
  checkInDate: checkIn,
  checkOutDate: checkOut,
  numGuests: 2,
  totalPrice: 15000,
  status: 'CONFIRMED',
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Bug Condition 3 — Cancel Desync on Success', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('calls fetchBookings() (getMyBookings) after a successful cancel, not just mutating local state', async () => {
    // First call: initial load; second call: re-fetch after cancel
    mockGetMyBookings
      .mockResolvedValueOnce([confirmedBooking])
      .mockResolvedValueOnce([{ ...confirmedBooking, status: 'CANCELLED' }]);

    mockCancelBooking.mockResolvedValue({ success: true });

    render(<MyBookings />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading your reservations/i)).not.toBeInTheDocument();
    });

    // Click "Cancel Booking"
    const cancelBtn = await screen.findByRole('button', { name: /Cancel Booking/i });
    await userEvent.click(cancelBtn);

    // FIXED behaviour: getMyBookings must be called twice (mount + re-fetch after cancel)
    // UNFIXED behaviour: called only once (mount only) — assertion fails
    await waitFor(() => {
      expect(mockGetMyBookings).toHaveBeenCalledTimes(2);
    });
  });
});
