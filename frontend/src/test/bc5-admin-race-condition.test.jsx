/**
 * Bug Condition 5 — AdminBookings Race Condition
 *
 * Expected (fixed) behavior : first click sets cancellingId, disables the
 *   button; second rapid click is a no-op; cancelBooking called exactly once.
 * Unfixed behavior           : no cancellingId guard in AdminBookings.jsx;
 *   second rapid click fires a second cancelBooking call before the first resolves.
 *
 * EXPECTED OUTCOME on unfixed code: FAILS
 * Counterexample: "cancelBooking(1) called 2 times on double-click"
 *
 * Validates: Requirements 1.8
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

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
const mockGetAllBookingsAdmin = vi.fn();

vi.mock('../services/bookingService', () => ({
  bookingService: {
    cancelBooking: (...args) => mockCancelBooking(...args),
    getAllBookingsAdmin: (...args) => mockGetAllBookingsAdmin(...args),
    getMyBookings: vi.fn(),
    createBooking: vi.fn(),
  },
}));

vi.mock('../context/NotificationContext', () => ({
  useNotification: () => ({ showError: vi.fn(), showSuccess: vi.fn(), showInfo: vi.fn() }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
    isAuthenticated: true,
    isAdmin: true,
  }),
}));

// AdminNav needs to be mocked to avoid further imports
vi.mock('../components/AdminNav', () => ({
  AdminNav: () => <nav data-testid="admin-nav" />,
}));

import { AdminBookings } from '../pages/AdminBookings';

// ── Test data ─────────────────────────────────────────────────────────────────

const tomorrow    = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
const fourDaysOut = new Date(); fourDaysOut.setDate(fourDaysOut.getDate() + 4);
const checkIn     = tomorrow.toISOString().split('T')[0];
const checkOut    = fourDaysOut.toISOString().split('T')[0];

const adminBooking = {
  id: 1,
  reservationNumber: 'RES-ADMIN-001',
  userId: 2,
  userName: 'Alice',
  userEmail: 'alice@test.com',
  numGuests: 2,
  hotelName: 'Grand Hotel',
  hotelCity: 'Chennai',
  roomCategory: 'Suite',
  checkInDate: checkIn,
  checkOutDate: checkOut,
  totalPrice: 25000,
  status: 'CONFIRMED',
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Bug Condition 5 — AdminBookings Race Condition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('calls cancelBooking exactly once even when Cancel Stay is clicked twice rapidly', async () => {
    mockGetAllBookingsAdmin.mockResolvedValue([adminBooking]);

    // Cancel takes 200ms to simulate a slow API — enough time for a second click
    mockCancelBooking.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 200))
    );

    render(<AdminBookings />);

    // Wait for bookings to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    const cancelBtn = await screen.findByRole('button', { name: /Cancel Stay/i });

    // Fire two rapid clicks before first resolves
    fireEvent.click(cancelBtn);
    fireEvent.click(cancelBtn);

    // Wait for the first API call to resolve
    await act(async () => {
      await new Promise((r) => setTimeout(r, 300));
    });

    // FIXED behavior: button was disabled after first click → only 1 call
    // UNFIXED behavior: no guard → both clicks go through → 2 calls
    expect(mockCancelBooking).toHaveBeenCalledTimes(1);
  });
});
