"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";
import { NavLinks } from "./NavLinks";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-slate-700 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div
        className={`fixed inset-0 z-50 bg-white lg:hidden ${open ? "visible" : "invisible"}`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <Link href="/" className="font-display text-lg font-bold text-ocean" onClick={() => setOpen(false)}>
              Lacanau Volley
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-slate-600"
              aria-label="Fermer le menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <NavLinks onLinkClick={() => setOpen(false)} />
          </nav>
          <div className="flex flex-col gap-2 border-t border-slate-200 p-4">
            <Link
              href="/boutique"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-ocean py-3 font-medium text-ocean"
            >
              <ShoppingBag className="h-4 w-4" />
              Boutique
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
