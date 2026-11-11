"use client";

import { useState } from "react";
import Link from "next/link";
import { formatEuro } from "@/lib/format";
import { FUEL_TYPE_LABELS, TRANSMISSION_LABELS } from "@/lib/constants";

export type CompareCar = {
  id: number;
  make: string;
  model: string;
  year: number;
  seats: number;
  transmission: "manual" | "automatic";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  pricePerDay: string;
  businessName: string;
  city: string;
};

const MAX_SELECTED = 4;

export function CompareBoard({ cars }: { cars: CompareCar[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [cityFilter, setCityFilter] = useState("");

  const cities = Array.from(new Set(cars.map((c) => c.city))).sort();
  const visible = cityFilter ? cars.filter((c) => c.city === cityFilter) : cars;
  const selectedCars = selected
    .map((id) => cars.find((c) => c.id === id))
    .filter((c): c is CompareCar => Boolean(c));

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_SELECTED
          ? prev
          : [...prev, id]
    );
  }

  const rows: { label: string; render: (c: CompareCar) => React.ReactNode }[] = [
    { label: "Business", render: (c) => c.businessName },
    { label: "City", render: (c) => c.city },
    { label: "Year", render: (c) => c.year },
    { label: "Seats", render: (c) => c.seats },
    { label: "Transmission", render: (c) => TRANSMISSION_LABELS[c.transmission] },
    { label: "Fuel type", render: (c) => FUEL_TYPE_LABELS[c.fuelType] },
    {
      label: "Price / day",
      render: (c) => <b style={{ color: "var(--brand)" }}>{formatEuro(c.pricePerDay)}</b>,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-sm font-semibold">City</span>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="h-10 rounded-lg border bg-[var(--page-chip-bg)] px-3 text-sm text-white"
          style={{ borderColor: "var(--page-chip-border)" }}
        >
          <option value="" className="text-black">
            All cities
          </option>
          {cities.map((city) => (
            <option key={city} value={city} className="text-black">
              {city}
            </option>
          ))}
        </select>
        <span className="text-sm text-[var(--page-ink-muted)]">
          Pick up to {MAX_SELECTED} cars to compare ({selected.length} selected)
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((car) => {
          const isSelected = selected.includes(car.id);
          return (
            <button
              key={car.id}
              type="button"
              onClick={() => toggle(car.id)}
              className="surface-card flex items-center justify-between gap-2 p-4 text-left transition"
              style={isSelected ? { outline: "2px solid var(--brand)", outlineOffset: "-1px" } : undefined}
            >
              <div>
                <div className="font-bold">
                  {car.make} {car.model}
                </div>
                <div className="text-sm text-[var(--muted)]">
                  {car.businessName} · {car.city}
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-[var(--brand)]">{formatEuro(car.pricePerDay)}</div>
                <div className="text-xs text-[var(--muted)]">
                  {isSelected ? "Selected ✓" : "Add"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedCars.length >= 2 && (
        <div className="surface-card mt-7 overflow-x-auto p-5">
          <div className="mb-3 text-lg font-extrabold">Comparison</div>
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-32 py-2 text-left text-[var(--muted)]"></th>
                {selectedCars.map((c) => (
                  <th key={c.id} className="border-b border-[var(--border)] px-3 py-2 text-left">
                    {c.make} {c.model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="py-2 pr-3 text-[var(--muted)]">{row.label}</td>
                  {selectedCars.map((c) => (
                    <td key={c.id} className="border-t border-[var(--border)] px-3 py-2">
                      {row.render(c)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="py-3"></td>
                {selectedCars.map((c) => (
                  <td key={c.id} className="border-t border-[var(--border)] px-3 py-3">
                    <Link href={`/car/${c.id}`} className="btn-brand-sm">
                      View &amp; book
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
