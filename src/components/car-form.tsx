"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { CarFormState } from "@/lib/actions/car";
import { TRANSMISSIONS, FUEL_TYPES, TRANSMISSION_LABELS, FUEL_TYPE_LABELS } from "@/lib/constants";

const initialState: CarFormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 flex h-12 items-center justify-center rounded-[10px] bg-[var(--brand)] px-6 text-[15px] font-bold text-white disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function CarForm({
  action,
  submitLabel,
  initial,
}: {
  action: (state: CarFormState, formData: FormData) => Promise<CarFormState>;
  submitLabel: string;
  initial?: {
    make?: string;
    model?: string;
    year?: number;
    seats?: number;
    transmission?: string;
    fuelType?: string;
    pricePerDay?: string;
    photoUrls?: string;
  };
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="surface-card p-5.5 sm:p-6">
      {state.error && (
        <div
          className="mb-4 rounded-lg px-3.5 py-2.5 text-sm font-medium"
          style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
        >
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Field label="Make" error={state.fieldErrors?.make}>
          <input type="text" name="make" defaultValue={initial?.make} required className="input-field" />
        </Field>
        <Field label="Model" error={state.fieldErrors?.model}>
          <input type="text" name="model" defaultValue={initial?.model} required className="input-field" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Field label="Year" error={state.fieldErrors?.year}>
          <input type="number" name="year" defaultValue={initial?.year} required className="input-field" />
        </Field>
        <Field label="Seats" error={state.fieldErrors?.seats}>
          <input type="number" name="seats" defaultValue={initial?.seats} required className="input-field" />
        </Field>
        <Field label="Transmission" error={state.fieldErrors?.transmission}>
          <select name="transmission" defaultValue={initial?.transmission ?? "manual"} className="input-field">
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {TRANSMISSION_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fuel type" error={state.fieldErrors?.fuelType}>
          <select name="fuelType" defaultValue={initial?.fuelType ?? "petrol"} className="input-field">
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {FUEL_TYPE_LABELS[f]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Price per day (EUR)" error={state.fieldErrors?.pricePerDay}>
        <input
          type="number"
          step="0.01"
          name="pricePerDay"
          defaultValue={initial?.pricePerDay}
          required
          className="input-field"
        />
      </Field>

      <Field label="Photo URLs (one per line, optional)">
        <textarea
          name="photoUrls"
          defaultValue={initial?.photoUrls}
          rows={3}
          placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
          className="input-field h-auto resize-none py-2.5 font-normal"
        />
      </Field>

      <SubmitButton label={submitLabel} />
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
