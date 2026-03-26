"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const navLinks = [
  { label: "Accueil", href: "#hero" },
  { label: "Le Club", href: "#club" },
  { label: "Activités", href: "#activities" },
  { label: "Galerie", href: "#gallery" },
  { label: "Rejoindre", href: "#join" },
  { label: "Contact", href: "#contact" },
] as const;

export function Navbar() {
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
          <Link href="#hero" className="flex items-center gap-3" aria-label="Aller à l'accueil">
            <span className="relative block h-10 w-[140px] md:h-12 md:w-[170px]">
              <Image
                src="/images/LVB1.png"
                alt="AS Lacanau Section Volley Ball"
                width={220}
                height={220}
                className="absolute left-0 top-1/2 h-[160px] w-[160px] -translate-y-1/2 object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] md:h-[190px] md:w-[190px]"
                priority
              />
            </span>
            <span className="hidden font-display text-3xl tracking-wide text-foam sm:block">
              Lacanau Volley
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
            <Link
              href="#join"
              data-cursor="hover"
              className="rounded-full bg-accent px-5 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-foam hover:text-ocean-deep"
            >
              Essai gratuit
            </Link>
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
              <div className="mt-auto">
                <Link
                  href="#join"
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

