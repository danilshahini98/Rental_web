import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const { next } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-7">
      <h1 className="text-2xl font-extrabold text-white">Owner login</h1>
      <p className="mt-1.5 text-sm text-[var(--page-ink-muted)]">
        Sign in to manage your businesses, cars, and booking requests.
      </p>
      <LoginForm next={next} />
    </div>
  );
}
