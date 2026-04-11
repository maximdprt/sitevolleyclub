"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";

type Props = {
  userName: string;
  userRole: string;
  children: React.ReactNode;
};

export function DashboardShell({ userName, userRole, children }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d2237] text-[#f0f7ff]">
      {isAdmin ? (
        <AdminSidebar />
      ) : (
        <Sidebar userRole={userRole} userName={userName} />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userName={userName} isAdmin={isAdmin} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
