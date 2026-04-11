"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { AuthUiProvider } from "@/components/providers/auth-ui-context";
import { SiteChrome } from "@/components/providers/SiteChrome";
import { LoginModal } from "@/components/auth/LoginModal";
import { AuthModalListener } from "@/components/auth/AuthModalListener";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthUiProvider>
        <SiteChrome>{children}</SiteChrome>
        <LoginModal />
        <Suspense fallback={null}>
          <AuthModalListener />
        </Suspense>
      </AuthUiProvider>
    </SessionProvider>
  );
}
