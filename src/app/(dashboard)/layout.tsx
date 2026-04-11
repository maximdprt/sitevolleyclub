import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/?auth=1");
  }
  if (session.user.status !== "ACTIVE") {
    redirect("/?auth=1&error=PENDING");
  }

  const displayName = session.user.name ?? session.user.username ?? "Adhérent";

  return (
    <>
      <DashboardShell userName={displayName} userRole={session.user.role}>
        {children}
      </DashboardShell>
      <Toaster position="bottom-right" />
    </>
  );
}
