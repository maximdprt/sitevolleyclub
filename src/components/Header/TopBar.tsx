"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react";

const socials = [
  { href: "https://www.facebook.com/volley.lacanau", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Youtube, label: "YouTube" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
];

export function TopBar() {
  return (
    <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm lg:px-8">
        <Link
          href="https://www.facebook.com/volley.lacanau"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-600 transition hover:text-ocean"
        >
          <span className="font-medium">Lacanau Volley-Ball</span>
          <span className="hidden sm:inline">— Page officielle</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Réseaux sociaux">
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-slate-500 transition hover:bg-sand hover:text-ocean"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
