"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthUi } from "@/components/providers/auth-ui-context";
import { getRoleHome } from "@/lib/permissions";

/**
 * Ouvre la modale si l’URL contient ?auth=1 (renvoyé par le middleware).
 */
export function AuthModalListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin } = useAuthUi();
  const { status, data: session } = useSession();
  const openedRef = React.useRef(false);

  React.useEffect(() => {
    const auth = searchParams.get("auth");
    if (auth !== "1") {
      openedRef.current = false;
      return;
    }

    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      const next = searchParams.get("next");
      const target =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : getRoleHome(session.user.role);
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      url.searchParams.delete("next");
      const qs = url.searchParams.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
      openedRef.current = false;
      router.push(target);
      return;
    }

    if (status === "unauthenticated" && !openedRef.current) {
      openedRef.current = true;
      openLogin();
    }
  }, [searchParams, status, session, openLogin, router, pathname]);

  return null;
}
