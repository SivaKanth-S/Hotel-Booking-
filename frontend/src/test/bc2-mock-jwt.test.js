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

  it('does NOT silently clear credentials when mock session receives a 401 response', () => {
    // Store the mock token as the unfixed AuthContext does
    localStorage.setItem('grandstay_jwt', MOCK_TOKEN);
    localStorage.setItem('grandstay_user', JSON.stringify({ role: 'ADMIN', email: 'admin@gmail.com' }));

    // Note: fixed code will also set 'grandstay_mock_session' = 'true'.
    // On UNFIXED code this flag is NOT set.
    const isMockSession = localStorage.getItem('grandstay_mock_session') === 'true';

    // Replicate exactly the response interceptor logic from the CURRENT (unfixed) api.js:
    //   if (error.response && error.response.status === 401) {
    //     const currentPath = window.location.pathname;
    //     if (currentPath !== '/login' && ...) {
    //       localStorage.removeItem('grandstay_jwt');
    //       localStorage.removeItem('grandstay_user');
    //     }
    //   }
    //
    // The FIXED interceptor should check isMockSession and skip credential clearing.
    const simulateUnfixedInterceptor = () => {
      const status = 401;
      const currentPath = window.location.pathname; // '/' in jsdom
      if (status === 401) {
        if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/admin/login') {
          // UNFIXED: always clears regardless of mock session
          localStorage.removeItem('grandstay_jwt');
          localStorage.removeItem('grandstay_user');
          // No notification dispatched
        }
      }
    };

    // The FIXED interceptor (what the code should do after the fix):
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

    // Run the UNFIXED interceptor (this is what the current code does)
    simulateUnfixedInterceptor();

    // ── FIXED behaviour assertions (FAIL on unfixed code) ──────────────────

    // 1. Credentials must NOT have been silently cleared when a mock token received 401
    //    On UNFIXED code, grandstay_jwt is null here → assertion fails
    expect(localStorage.getItem('grandstay_jwt')).toBe(MOCK_TOKEN);
  });

  it('shows a user-visible error notification when mock session receives a 401 response', () => {
    // Store mock token
    localStorage.setItem('grandstay_jwt', MOCK_TOKEN);
    localStorage.setItem('grandstay_user', JSON.stringify({ role: 'ADMIN', email: 'admin@gmail.com' }));
    // On UNFIXED code, grandstay_mock_session is NOT set
    // Therefore the fixed interceptor path that calls notifyFn is never reached

    const notificationSpy = vi.fn();

    // Simulate the UNFIXED interceptor — it does NOT call notificationSpy
    const simulateUnfixedInterceptor = () => {
      const status = 401;
      const currentPath = window.location.pathname;
      if (status === 401) {
        if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/admin/login') {
          localStorage.removeItem('grandstay_jwt');
          localStorage.removeItem('grandstay_user');
          // No notification — this is the bug
        }
      }
    };

    simulateUnfixedInterceptor();

    // On UNFIXED code: notificationSpy never called → assertion fails
    expect(notificationSpy).toHaveBeenCalledWith(
      expect.stringMatching(/offline session|sign in again|not valid/i)
    );
  });
});
