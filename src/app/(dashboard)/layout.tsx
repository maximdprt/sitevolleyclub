import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.status !== "ACTIVE") redirect("/login?error=PENDING");

  const displayName = session.user.name ?? session.user.username ?? "Adhérent";

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d2237] text-[#f0f7ff]">
      <Sidebar
        userRole={session.user.role}
        userName={displayName}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userName={displayName} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
