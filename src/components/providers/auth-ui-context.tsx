"use client";

import * as React from "react";

type AuthUiContextValue = {
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
};

const AuthUiContext = React.createContext<AuthUiContextValue | null>(null);

export function AuthUiProvider({ children }: { children: React.ReactNode }) {
  const [loginOpen, setLoginOpen] = React.useState(false);

  const openLogin = React.useCallback(() => setLoginOpen(true), []);
  const closeLogin = React.useCallback(() => setLoginOpen(false), []);

  const value = React.useMemo(
    () => ({ loginOpen, openLogin, closeLogin }),
    [loginOpen, openLogin, closeLogin]
  );

  return <AuthUiContext.Provider value={value}>{children}</AuthUiContext.Provider>;
}

export function useAuthUi() {
  const ctx = React.useContext(AuthUiContext);
  if (!ctx) throw new Error("useAuthUi must be used within AuthUiProvider");
  return ctx;
}
