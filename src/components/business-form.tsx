"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import type { BusinessFormState } from "@/lib/actions/business";
import { ALBANIAN_CITIES } from "@/lib/constants";

const LocationPicker = dynamic(
  () => import("@/components/location-picker").then((m) => m.LocationPicker),
  { ssr: false, loading: () => <div className="map-panel h-[240px] animate-pulse" /> }
);

const initialState: BusinessFormState = {};

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

export function BusinessForm({
  action,
  submitLabel,
  initial,
}: {
  action: (state: BusinessFormState, formData: FormData) => Promise<BusinessFormState>;
  submitLabel: string;
  initial?: {
    name?: string;
    address?: string;
    city?: string;
    phone?: string;
    description?: string;
    lat?: number;
    lng?: number;
  };
}) {
  const [state, formAction] = useActionState(action, initialState);
  const [lat, setLat] = useState<number | null>(initial?.lat ?? null);
  const [lng, setLng] = useState<number | null>(initial?.lng ?? null);

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

      <Field label="Business name" error={state.fieldErrors?.name}>
        <input type="text" name="name" defaultValue={initial?.name} required className="input-field" />
      </Field>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Field label="City" error={state.fieldErrors?.city}>
          <select name="city" defaultValue={initial?.city ?? ""} required className="input-field">
            <option value="" disabled>
              Choose a city
            </option>
            {ALBANIAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Phone" error={state.fieldErrors?.phone}>
          <input type="text" name="phone" defaultValue={initial?.phone} required className="input-field" />
        </Field>
      </div>

      <Field label="Address" error={state.fieldErrors?.address}>
        <input type="text" name="address" defaultValue={initial?.address} required className="input-field" />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          defaultValue={initial?.description}
          rows={3}
          className="input-field h-auto resize-none py-2.5"
        />
      </Field>

      <div className="mt-4">
        <label className="mb-1.5 block text-[13px] font-bold">
          Location — click the map to set coordinates
        </label>
        <LocationPicker lat={lat} lng={lng} onChange={(la, ln) => {
          setLat(la);
          setLng(ln);
        }} />
        <div className="mt-2.5 grid grid-cols-2 gap-3.5">
          <Field label="Latitude" error={state.fieldErrors?.lat}>
            <input
              type="number"
              step="any"
              name="lat"
              required
              value={lat ?? ""}
              onChange={(e) => setLat(e.target.value === "" ? null : Number(e.target.value))}
              className="input-field"
            />
          </Field>
          <Field label="Longitude" error={state.fieldErrors?.lng}>
            <input
              type="number"
              step="any"
              name="lng"
              required
              value={lng ?? ""}
              onChange={(e) => setLng(e.target.value === "" ? null : Number(e.target.value))}
              className="input-field"
            />
          </Field>
        </div>
      </div>

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
