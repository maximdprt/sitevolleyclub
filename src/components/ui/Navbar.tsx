"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { useAuthUi } from "@/components/providers/auth-ui-context";
import { getRoleHome } from "@/lib/permissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { label: "Accueil", href: "/#hero" },
  { label: "Le Club", href: "/#club" },
  { label: "Activités", href: "/#activities" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/#gallery" },
  { label: "Rejoindre", href: "/#join" },
  { label: "Contact", href: "/#contact" },
] as const;

export function Navbar() {
  const { data: session, status } = useSession();
  const { openLogin } = useAuthUi();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navClass = useMemo(
    () =>
      scrolled
        ? "bg-ocean-deep/92 backdrop-blur-xl shadow-2xl"
        : "bg-transparent backdrop-blur-md",
    [scrolled],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.nav
        className={`fixed left-0 right-0 top-0 z-50 pt-2 transition-all duration-400 ${navClass}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 pb-3 pt-2 md:px-8 md:pb-3 md:pt-2">
          <Link
            href="/#hero"
            className="ml-6 flex items-center gap-3 md:ml-10"
            aria-label="Aller à l'accueil"
          >
            <span className="relative block h-8 w-[90px] md:h-10 md:w-[100px]">
              <Image
                src="/images/LVC_FINAL%20LOGO-04.png"
                alt="AS Lacanau Section Volley Ball"
                width={190}
                height={190}
                className="absolute left-1 top-[56%] max-h-[100px] w-auto -translate-y-1/2 object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] md:left-2 md:max-h-[145px]"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group relative font-ui text-[11px] uppercase tracking-[0.18em] text-sand-light/85 transition hover:text-foam"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-1/2 h-px w-4/5 -translate-x-1/2 scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {status === "authenticated" && session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1.5 pr-3 font-ui text-xs text-foam transition hover:bg-white/10"
                      aria-label="Menu compte"
                    >
                      <Avatar className="h-8 w-8 border border-white/20">
                        {session.user.image ? (
                          <AvatarImage src={session.user.image} alt="" />
                        ) : null}
                        <AvatarFallback className="bg-ocean/80 text-[10px] text-foam">
                          {(session.user.name ?? session.user.email ?? "?")
                            .split(" ")
                            .map((s) => s[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden max-w-[120px] truncate sm:inline">
                        {session.user.name ?? session.user.email}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-48">
                    <DropdownMenuItem asChild>
                      <Link href={getRoleHome(session.user.role)}>
                        <User className="h-4 w-4" />
                        Mon espace
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-red-400 focus:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  type="button"
                  onClick={() => openLogin()}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2.5 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-white/10"
                >
                  Se connecter
                </button>
              )}
              <Link
                href="/#join"
                data-cursor="hover"
                className="rounded-full bg-accent px-5 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-foam hover:text-ocean-deep"
              >
                Essai gratuit
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="relative h-10 w-10 md:hidden"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
            data-cursor="hover"
          >
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 bg-foam transition-transform duration-300 ${
                open ? "translate-y-0 rotate-45" : "-translate-y-2.5"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 bg-foam transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 bg-foam transition-transform duration-300 ${
                open ? "translate-y-0 -rotate-45" : "translate-y-2.5"
              }`}
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 bg-ocean-deep"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex h-full flex-col px-6 pb-10 pt-24">
              <div className="flex flex-col gap-6">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl tracking-wide text-foam"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3">
                {status === "authenticated" && session?.user ? (
                  <>
                    <Link
                      href={getRoleHome(session.user.role)}
                      onClick={() => setOpen(false)}
                      className="inline-flex rounded-full border border-white/20 px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam"
                    >
                      Mon espace
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        void signOut({ callbackUrl: "/" });
                      }}
                      className="inline-flex rounded-full bg-white/10 px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openLogin();
                    }}
                    className="inline-flex rounded-full border border-white/25 px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam"
                  >
                    Se connecter
                  </button>
                )}
                <Link
                  href="/#join"
                  onClick={() => setOpen(false)}
                  className="inline-flex rounded-full bg-accent px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam"
                >
                  Essai gratuit
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

