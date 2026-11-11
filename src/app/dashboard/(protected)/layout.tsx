import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 sm:py-9">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <DashboardSidebar email={session.email} />
        <div>{children}</div>
      </div>
    </div>
  );
}
