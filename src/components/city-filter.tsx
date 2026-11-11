"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CityFilter({ cities }: { cities: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("city") ?? "";

  return (
    <div className="my-5 flex items-center gap-2.5">
      <span className="text-sm font-semibold">City</span>
      <select
        className="h-10 rounded-lg border bg-[var(--page-chip-bg)] px-3 text-sm text-white"
        style={{ borderColor: "var(--page-chip-border)" }}
        value={current}
        onChange={(e) => {
          const value = e.target.value;
          const params = new URLSearchParams(searchParams.toString());
          if (value) params.set("city", value);
          else params.delete("city");
          router.push(params.size > 0 ? `/?${params.toString()}` : "/");
        }}
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
    </div>
  );
}
