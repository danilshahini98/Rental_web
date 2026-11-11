/**
 * Two date ranges "overlap" (conservatively) if they share any day, inclusive
 * of both pickup and return dates. ISO "YYYY-MM-DD" strings compare correctly
 * as plain strings, so no Date parsing is needed here.
 *
 * This is intentionally conservative: a return on the same day as another
 * booking's pickup counts as an overlap (no same-day handover assumed).
 */
export function dateRangesOverlap(
  aPickup: string,
  aReturn: string,
  bPickup: string,
  bReturn: string
): boolean {
  return aPickup <= bReturn && bPickup <= aReturn;
}
