"use client";

import Image from "next/image";
import Link from "next/link";
import { WaveDivider } from "@/components/ui/WaveDivider";

export function Footer() {
  return (
    <footer className="bg-ocean-deep text-foam">
      <WaveDivider color="var(--ocean-deep)" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="font-display text-4xl tracking-wide text-foam">Lacanau Volley Ball</div>
            <div className="mt-2 font-body italic text-sand-light/80">
              Entre océan et forêt • Depuis 2010
            </div>
            <Image
              src="/images/LVB1.png"
              alt="AS Lacanau Section Volley Ball"
              width={260}
              height={260}
              className="mt-6 h-[190px] w-[190px] object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)] md:h-[230px] md:w-[230px]"
              loading="lazy"
            />
          </div>

          <div>
            <div className="font-ui text-xs uppercase tracking-[0.2em] text-sand-light/80">Horaires</div>
            <ul className="mt-5 space-y-3 text-foam/85">
              <li>🏐 Mardi 20h00 — Salle Cosec</li>
              <li>🏐 Jeudi 20h30 — Salle Cosec</li>
              <li>🏖️ Dimanche 10h00 — Ardilouse</li>
            </ul>
          </div>

          <div>
            <div className="font-ui text-xs uppercase tracking-[0.2em] text-sand-light/80">Navigation</div>
            <ul className="mt-5 space-y-3 text-foam/85">
              {[
                { label: "Le Club", href: "#club" },
                { label: "Activités", href: "#activities" },
                { label: "Galerie", href: "#gallery" },
                { label: "Rejoindre", href: "#join" },
                { label: "Contact", href: "#contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline decoration-white/10 underline-offset-4 hover:decoration-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="#join"
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam backdrop-blur transition hover:bg-white/10"
              >
                S&apos;inscrire / Nous rejoindre
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-sand-light/70">
          <div className="mb-3 font-ui text-[11px] uppercase tracking-[0.18em] text-sand-light/70">
            RGPD
          </div>
          <div className="text-sand-light/70">
            Ce site utilise uniquement des données nécessaires pour vous recontacter lorsque vous nous contactez. Pour toute demande, écrivez-nous à{" "}
            <a
              className="underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
              href="mailto:david.lacanau33@orange.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              david.lacanau33@orange.fr
            </a>
            .
          </div>
          © 2025 AS Lacanau Section Volley Ball · Tous droits réservés
        </div>
      </div>
    </footer>
  );
}

