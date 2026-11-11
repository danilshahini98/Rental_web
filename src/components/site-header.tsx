import Link from "next/link";
import { getSession } from "@/lib/auth/session";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--page-border)] bg-[#0a0a0dB8] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3.5 sm:px-7">
        <Link href="/" className="flex items-center gap-2.5 text-[17px] sm:text-xl font-extrabold">
          <span
            className="flex h-8 w-8 sm:h-[34px] sm:w-[34px] items-center justify-center rounded-[9px]"
            style={{ background: "var(--brand)", boxShadow: "0 0 18px rgba(200,16,46,.55)" }}
          >
            <svg viewBox="0 0 64 28" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="#fff">
              <use href="#car-ico" />
            </svg>
          </span>
          <span>
            RentAlba<span style={{ color: "var(--brand)" }}>nia</span>
          </span>
        </Link>
        <nav className="flex items-center gap-0 sm:gap-1.5">
          <Link
            href="/"
            className="whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium text-white/70 hover:bg-white/8 hover:text-white sm:px-3.5 sm:text-sm"
          >
            Businesses
          </Link>
          <Link
            href="/compare"
            className="whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium text-white/70 hover:bg-white/8 hover:text-white sm:px-3.5 sm:text-sm"
          >
            Compare cars
          </Link>
          {session ? (
            <Link
              href="/dashboard"
              className="ml-1 whitespace-nowrap rounded-lg border border-[var(--page-chip-border)] bg-[var(--page-chip-bg)] px-2.5 py-2 text-xs font-medium text-white sm:px-3.5 sm:text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/dashboard/login"
              className="ml-1 whitespace-nowrap rounded-lg border border-[var(--page-chip-border)] bg-[var(--page-chip-bg)] px-2.5 py-2 text-xs font-medium text-white sm:px-3.5 sm:text-sm"
            >
              Owner login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
