/**
 * Bug Condition 6 — Fragile String Date Comparison
 *
 * Expected (fixed) behavior : the check-in date validation in BookingModal
 *   uses `new Date(checkInDate) < new Date(todayStr)` — Date object comparison.
 * Unfixed behavior           : uses raw string comparison `checkInDate < todayStr`,
 *   which is inconsistent with the check-out validation and error-prone across
 *   locales/timezones.
 *
 * The raw string comparison `checkInDate < todayStr` has the same result
 * as `new Date(checkInDate) < new Date(todayStr)` for ISO date strings
 * on most systems, BUT the unfixed code passes checkInDate as a raw string
 * directly to the < operator without wrapping it in `new Date()`.
 *
 * Testable difference: the UNFIXED code path (checkInDate < todayStr) means
 * the source code literally contains a string comparison. We test the INTENT:
 * for a date-string like "2030-01-01" (clearly future), the check-in validation
 * should NOT fire. And for "2020-01-01" (past), it SHOULD fire.
 * Both string and Date comparison agree on ISO strings — so the bug is
 * structural (inconsistency) rather than behavioral in typical usage.
 *
 * To produce a behavioral failure on unfixed code, we set checkInDate to
 * today's string — exactly today. The fixed validation uses:
 *   `new Date(checkInDate) < new Date(todayStr)`
 * which for today = today evaluates to FALSE (today is NOT before today).
 * The unfixed validation uses:
 *   `checkInDate < todayStr`
 * which also evaluates to FALSE for identical strings.
 *
 * However the spec says the bug is about the inconsistency in method.
 * We test a behavioral difference by examining the source code directly:
 * we verify that the BookingModal source contains `new Date(checkInDate)`
 * rather than a bare `checkInDate <` comparison.
 *
 * EXPECTED OUTCOME on unfixed code: FAILS
 * Counterexample: "check-in validation: `checkInDate < todayStr` (string) found,
 *                  `new Date(checkInDate)` NOT used for the check-in comparison"
 *
 * Validates: Requirements 1.9
 */

import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Bug Condition 6 — Fragile String Date Comparison', () => {
  it('BookingModal check-in validation uses new Date(checkInDate) not a raw string comparison', () => {
    // Read the source of BookingModal.jsx directly
    const srcPath = resolve(
      import.meta.dirname,
      '../components/BookingModal.jsx'
    );
    const src = readFileSync(srcPath, 'utf-8');

    // The UNFIXED code contains: `checkInDate < todayStr`
    // The FIXED code replaces it with: `new Date(checkInDate) < new Date(todayStr)`

    // Assert the buggy raw string comparison is NOT present
    // On UNFIXED code: this assertion FAILS because `checkInDate < todayStr` IS present
    expect(src).not.toMatch(/checkInDate\s*<\s*todayStr/);

    // Assert the fixed Date-object comparison IS present
    // On UNFIXED code: this assertion FAILS because it doesn't exist yet
    expect(src).toMatch(/new Date\(checkInDate\)\s*<\s*new Date\(todayStr\)/);
  });
});
