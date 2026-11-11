"use client";

import { useState, useTransition } from "react";
import { confirmBookingAction, declineBookingAction } from "@/lib/actions/booking-admin";

export function BookingActions({ bookingId }: { bookingId: number }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: (id: number) => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action(bookingId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-start gap-2">
        <div className="group relative">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(confirmBookingAction)}
            className="btn-brand-sm disabled:opacity-60"
          >
            Confirm
          </button>
          <div
            className="pointer-events-none absolute bottom-[120%] left-1/2 w-[240px] -translate-x-1/2 rounded-lg px-3 py-2.5 text-center text-[12.5px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100"
            style={{ background: "var(--accent)" }}
          >
            Blocked automatically if this car already has a confirmed booking on overlapping
            dates
          </div>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(declineBookingAction)}
          className="rounded-[10px] bg-[var(--surface-muted)] px-4.5 py-2 text-sm font-bold text-[#444850] disabled:opacity-60"
        >
          Decline
        </button>
      </div>
      {error && <p className="max-w-[220px] text-right text-[12px] font-medium text-[var(--danger)]">{error}</p>}
    </div>
  );
}
