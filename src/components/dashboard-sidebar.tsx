"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/businesses", label: "Businesses" },
  { href: "/dashboard/bookings", label: "Booking requests" },
];

export function DashboardSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="surface-card p-4">
        <div className="text-xs text-[var(--muted)]">Signed in as</div>
        <div className="mt-0.5 truncate text-sm font-bold">{email}</div>
      </div>
      <nav className="mt-1">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-semibold"
              style={{
                background: active ? "rgba(255,255,255,.08)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,.68)",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="mt-2.5">
        <button
          type="submit"
          className="surface-card w-full px-3 py-2.5 text-left text-sm font-semibold text-[var(--muted)]"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
