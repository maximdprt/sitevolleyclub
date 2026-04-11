"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { isDashboardLikePath } from "@/lib/permissions";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidePublicNav = isDashboardLikePath(pathname);

  if (hidePublicNav) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
