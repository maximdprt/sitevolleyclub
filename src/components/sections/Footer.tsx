"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/site";

const navLinks = [
  { label: "Le Club", href: "#club" },
  { label: "Activités", href: "#activities" },
  { label: "Galerie", href: "#gallery" },
  { label: "Rejoindre", href: "#join" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-ocean-deep text-foam">
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Image
                src="/images/LVC_FINAL%20LOGO-08%20(1).png"
                alt="AS Lacanau Section Volley Ball"
                width={120}
                height={120}
                className="h-20 w-auto object-contain"
                loading="lazy"
              />
              <div className="mt-4 font-display text-3xl leading-tight tracking-wide text-foam">Lacanau Volley Ball</div>
              <div className="mt-1 text-sm text-foam/50">Entre océan et forêt · Depuis 2010</div>
              <div className="mt-4 flex gap-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-foam/70 transition hover:bg-white/10 hover:text-foam"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-foam/70 transition hover:bg-white/10 hover:text-foam"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-foam/40">Horaires</div>
              <ul className="mt-4 space-y-2 text-sm text-foam/75">
                <li>🏐 Mardi 20h00 — COSEC</li>
                <li>🏐 Jeudi 20h30 — COSEC</li>
                <li>🏖️ Samedi 10h00–13h00 — Ardilouse</li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-foam/40">Navigation</div>
              <ul className="mt-4 space-y-2">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-foam/75 hover:text-foam transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="#join"
                className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-foam transition hover:bg-white/8"
              >
                Rejoindre le club →
              </Link>
            </div>
          </div>

          <div className="mt-12 border-t border-white/8 pt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-foam/40">
                © 2025 AS Lacanau Section Volley Ball · Tous droits réservés
              </div>
              <div className="text-xs text-foam/40">
                Ce site utilise uniquement des données nécessaires pour vous recontacter.{" "}
                <a href="mailto:contact@lacanauvolley.fr" className="underline underline-offset-4 decoration-white/20 hover:decoration-foam/40">
                  contact@lacanauvolley.fr
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
