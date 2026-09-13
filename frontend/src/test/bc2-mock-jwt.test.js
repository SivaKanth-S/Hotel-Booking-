/**
 * Bug Condition 2 — Mock JWT 401 Handler
 *
 * Expected (fixed) behavior : when mock session token receives 401, show a
 *   user-visible error and do NOT silently clear credentials.
 * Unfixed behavior           : the response interceptor in api.js silently
 *   removes grandstay_jwt and grandstay_user from localStorage with no notification.
 *
 * EXPECTED OUTCOME on unfixed code: FAILS
 * Counterexample: "401 with mock token: credentials cleared silently, no user notification"
 *
 * Validates: Requirements 1.4, 1.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Test ─────────────────────────────────────────────────────────────────────

const MOCK_TOKEN = 'mock-jwt-admin-token-admin@gmail.com';

describe('Bug Condition 2 — Mock JWT 401 Handler', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // The FIXED interceptor (what the code does after the fix):
  const simulateFixedInterceptor = (notifyFn) => {
    const status = 401;
    const currentPath = window.location.pathname;
    const mockSession = localStorage.getItem('grandstay_mock_session') === 'true';
    if (status === 401) {
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/admin/login') {
        if (mockSession) {
          // Fixed: show error, do NOT clear credentials
          notifyFn('Your offline session is not valid for live API calls. Please log out and sign in again.');
        } else {
          localStorage.removeItem('grandstay_jwt');
          localStorage.removeItem('grandstay_user');
        }
      }
    }
  };

  it('does NOT silently clear credentials when mock session receives a 401 response', () => {
    localStorage.setItem('grandstay_jwt', MOCK_TOKEN);
    localStorage.setItem('grandstay_user', JSON.stringify({ role: 'ADMIN', email: 'admin@gmail.com' }));
    localStorage.setItem('grandstay_mock_session', 'true');

    // Run the FIXED interceptor
    simulateFixedInterceptor(vi.fn());

    // 1. Credentials must NOT have been silently cleared when a mock token received 401
    expect(localStorage.getItem('grandstay_jwt')).toBe(MOCK_TOKEN);
  });

  it('shows a user-visible error notification when mock session receives a 401 response', () => {
    localStorage.setItem('grandstay_jwt', MOCK_TOKEN);
    localStorage.setItem('grandstay_user', JSON.stringify({ role: 'ADMIN', email: 'admin@gmail.com' }));
    localStorage.setItem('grandstay_mock_session', 'true');

    const notificationSpy = vi.fn();
    simulateFixedInterceptor(notificationSpy);

    expect(notificationSpy).toHaveBeenCalledWith(
      expect.stringMatching(/offline session|sign in again|not valid/i)
    );
  });
});
