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
    () => scrolled ? "bg-ocean-deep/95 shadow-lg" : "bg-transparent",
    [scrolled],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${navClass}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 md:px-10">
          {/* Logo */}
          <Link href="/#hero" aria-label="Accueil" className="flex items-center">
            <Image
              src="/images/LVC_FINAL%20LOGO-08%20(1).png"
              alt="Lacanau Volley Ball"
              width={120}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-foam/75 transition hover:text-foam"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {status === "authenticated" && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-foam transition hover:bg-white/10"
                    aria-label="Menu compte"
                  >
                    <Avatar className="h-6 w-6 border border-white/20">
                      {session.user.image ? <AvatarImage src={session.user.image} alt="" /> : null}
                      <AvatarFallback className="bg-ocean/80 text-[10px] text-foam">
                        {(session.user.name ?? session.user.email ?? "?")
                          .split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-[100px] truncate sm:inline">
                      {session.user.name ?? session.user.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44">
                  <DropdownMenuItem asChild>
                    <Link href={getRoleHome(session.user.role)}>
                      <User className="h-4 w-4" />
                      Mon espace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-400 focus:text-red-400">
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                onClick={() => openLogin()}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-foam transition hover:bg-white/8"
              >
                Se connecter
              </button>
            )}
            <Link
              href="/#join"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-foam transition hover:bg-accent-light"
            >
              Essai gratuit
            </Link>
          </div>

          {/* Burger */}
          <button
            type="button"
            className="relative h-9 w-9 md:hidden"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 bg-foam transition-transform duration-200 ${open ? "translate-y-0 rotate-45" : "-translate-y-2"}`} />
            <span className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 bg-foam transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 bg-foam transition-transform duration-200 ${open ? "translate-y-0 -rotate-45" : "translate-y-2"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-ocean-deep px-6 pb-10 pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 font-display text-4xl tracking-wide text-foam transition hover:bg-white/5"
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
                    className="rounded-xl border border-white/15 px-5 py-3 text-center text-sm font-semibold text-foam"
                  >
                    Mon espace
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); void signOut({ callbackUrl: "/" }); }}
                    className="rounded-xl bg-white/8 px-5 py-3 text-sm font-semibold text-foam"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => { setOpen(false); openLogin(); }}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-foam"
                >
                  Se connecter
                </button>
              )}
              <Link
                href="/#join"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-accent px-5 py-3 text-center text-sm font-semibold text-foam transition hover:bg-accent-light"
              >
                Essai gratuit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
