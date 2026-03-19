"use client";

import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { User, ShoppingBag, Ticket } from "lucide-react";

const ctaLinks = [
  { label: "Boutique", href: "/boutique", icon: ShoppingBag },
];

export function MainNav() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 lg:px-8">
      <Link href="/" className="shrink-0 font-display text-xl font-bold tracking-tight text-ocean">
        Lacanau Volley
      </Link>
      <nav className="hidden lg:block" aria-label="Navigation principale">
        <NavLinks />
      </nav>
      <div className="flex items-center gap-2">
        {ctaLinks.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="hidden items-center gap-2 rounded-full bg-ocean px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ocean-light sm:flex"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="rounded-full p-2.5 text-slate-600 transition hover:bg-sand hover:text-ocean"
          aria-label="Mon compte"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
