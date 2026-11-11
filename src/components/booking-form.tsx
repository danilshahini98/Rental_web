"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBookingAction, type BookingState } from "@/lib/actions/booking";
import { estimateTotal, formatEuro } from "@/lib/format";

const initialState: BookingState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4.5 flex h-12 w-full items-center justify-center rounded-[10px] bg-[var(--brand)] text-[15px] font-bold text-white transition disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send booking request"}
    </button>
  );
}

export function BookingForm({ carId, pricePerDay }: { carId: number; pricePerDay: number | string }) {
  const [state, formAction] = useActionState(createBookingAction, initialState);
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const estimate =
    pickupDate && returnDate && returnDate > pickupDate
      ? estimateTotal(pricePerDay, pickupDate, returnDate)
      : null;

  const fieldErrors = state.status === "error" ? state.fieldErrors ?? {} : {};

  if (state.status === "success") {
    return (
      <div className="surface-card p-5.5 sm:p-6">
        <div className="flex items-center gap-2 text-lg font-extrabold" style={{ color: "var(--success)" }}>
          ✓ Request sent
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{state.message}</p>
        <p className="mt-3 text-[12px] leading-relaxed text-[var(--muted)]">
          This is a <b className="text-[var(--foreground)]">request, not a confirmed booking</b>.
          No payment was collected.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="surface-card p-5.5 sm:p-6">
      <input type="hidden" name="carId" value={carId} />
      <div className="text-lg font-extrabold">Request this car</div>

      {state.status === "error" && state.message && (
        <div
          className="mt-3 rounded-lg px-3.5 py-2.5 text-sm font-medium"
          style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
        >
          {state.message}
        </div>
      )}

      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        <Field label="Pickup date" error={fieldErrors.pickupDate}>
          <input
            type="date"
            name="pickupDate"
            min={todayIso}
            required
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="input-field"
          />
        </Field>
        <Field label="Return date" error={fieldErrors.returnDate}>
          <input
            type="date"
            name="returnDate"
            min={pickupDate || todayIso}
            required
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="input-field"
          />
        </Field>
      </div>

      <div className="mt-4.5 flex items-center justify-between rounded-[10px] bg-[var(--surface-muted)] px-4 py-3.5 text-sm text-[#5c5f66]">
        {estimate ? (
          <>
            <span>
              {formatEuro(pricePerDay)} × {estimate.days} {estimate.days === 1 ? "day" : "days"}
            </span>
            <b className="text-[22px] text-[var(--brand)]">{formatEuro(estimate.total)}</b>
          </>
        ) : (
          <span>Choose your pickup and return dates to see the estimated total.</span>
        )}
      </div>

      <Field label="Full name" error={fieldErrors.customerName}>
        <input type="text" name="customerName" required className="input-field" placeholder="Elira Hoxha" />
      </Field>
      <div className="grid grid-cols-2 gap-3.5">
        <Field label="Email" error={fieldErrors.customerEmail}>
          <input type="email" name="customerEmail" required className="input-field" placeholder="you@example.com" />
        </Field>
        <Field label="Phone" error={fieldErrors.customerPhone}>
          <input type="tel" name="customerPhone" required className="input-field" placeholder="+355 69 000 0000" />
        </Field>
      </div>
      <Field label="Notes (optional)">
        <textarea
          name="notes"
          rows={2}
          className="input-field h-auto resize-none py-2.5"
          placeholder="Arriving on a late flight, around 11pm."
        />
      </Field>

      <SubmitButton />
      <p className="mt-3 text-[12px] leading-relaxed text-[var(--muted)]">
        This is a <b className="text-[var(--foreground)]">request, not a confirmed booking</b>.
        The business will review it and confirm directly with you. We never collect payment on
        this site.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <label className="mb-1.5 block text-[13px] font-bold">{label}</label>
      {children}
      {error && <p className="mt-1 text-[12px] font-medium text-[var(--danger)]">{error}</p>}
    </div>
  );
}
