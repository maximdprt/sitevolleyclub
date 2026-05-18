"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useEffect, useMemo, useState } from "react";

function getNextThursdayAt2030(now = new Date()) {
  const d = new Date(now);
  d.setSeconds(0, 0);
  const day = d.getDay();
  const daysUntilThursday = (4 - day + 7) % 7;
  d.setDate(d.getDate() + daysUntilThursday);
  d.setHours(20, 30, 0, 0);
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 7);
  return d;
}

function formatCountdown(target: Date, now: Date) {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "En cours";
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes - days * 60 * 24) / 60);
  const minutes = totalMinutes - days * 60 * 24 - hours * 60;
  const dd = days > 0 ? `${days}j ` : "";
  return `${dd}${hours}h ${minutes}m`;
}

function formatDateFR(d: Date) {
  return d.toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Championship() {
  const next = useMemo(() => getNextThursdayAt2030(), []);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="championship" className="bg-foam py-20 text-ocean-deep">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 md:px-10 lg:grid-cols-2">
        <ScrollReveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-wave">Compétition</div>
          <h2 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">
            Nos équipes en compétition
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ocean-deep/75">
            Participation régulière au championnat loisir Volley&apos;Lib. 12 licenciées en Compet&apos;Lib.
          </p>
          <p className="mt-3 text-sm text-ocean-deep/65">
            Les calendriers et résultats sont consultables sur{" "}
            <Link href="https://www.ffvb.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-accent/50 hover:decoration-accent">
              ffvb.org
            </Link>.
          </p>
          <div className="mt-8 flex items-baseline gap-3">
            <div className="font-display text-[110px] leading-none text-accent">12</div>
            <div className="text-sm font-medium text-ocean-deep/60">Licenciées<br />Compet&apos;Lib</div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-ocean-deep/10 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-ocean-deep/50">Prochain entraînement</div>
                <div className="mt-1 font-display text-3xl leading-tight tracking-wide text-ocean-deep">
                  Compétition loisir
                </div>
              </div>
              <div className="rounded-xl border border-ocean-deep/10 bg-sand-light/60 px-4 py-3 text-center">
                <div className="text-xs text-ocean-deep/50">Début dans</div>
                <div className="mt-1 font-display text-2xl leading-none text-accent">{formatCountdown(next, now)}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-ocean-deep/8 bg-sand-light/30 px-4 py-3">
                <div className="text-xs font-semibold text-ocean-deep/50">Date</div>
                <div className="mt-1 text-sm text-ocean-deep/80">{formatDateFR(next)}</div>
              </div>
              <div className="rounded-xl border border-ocean-deep/8 bg-sand-light/30 px-4 py-3">
                <div className="text-xs font-semibold text-ocean-deep/50">Lieu</div>
                <div className="mt-1 text-sm text-ocean-deep/80">COSEC · Lacanau</div>
              </div>
              <div className="rounded-xl border border-ocean-deep/8 bg-sand-light/30 px-4 py-3">
                <div className="text-xs font-semibold text-ocean-deep/50">Infos</div>
                <div className="mt-1 text-sm text-ocean-deep/80">Calendrier sur FFVB</div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="https://www.ffvb.org" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-ocean-deep px-5 py-2.5 text-sm font-semibold text-foam transition hover:bg-ocean">
                Voir sur FFVB →
              </Link>
              <Link href="#join" className="rounded-xl border border-ocean-deep/15 px-5 py-2.5 text-sm font-semibold text-ocean-deep transition hover:bg-sand-light/40">
                Essai gratuit →
              </Link>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              { title: "Résultats", body: "Les résultats seront renseignés ici au fil de la saison." },
              { title: "Classements & agenda", body: "Accès direct aux équipes et calendriers via la fédération." },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-ocean-deep/10 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-ocean-deep">{c.title}</div>
                <div className="mt-2 text-sm text-ocean-deep/65">{c.body}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
