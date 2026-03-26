"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function getNextThursdayAt2030(now = new Date()) {
  const d = new Date(now);
  d.setSeconds(0, 0);
  // JS: 0=Sun..6=Sat, Thursday=4
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
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 md:px-8 lg:grid-cols-[1fr_1fr]">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-ocean-deep/10 bg-white px-5 py-2 font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep">
            <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
            Saison en cours
          </div>

          <h2 className="mt-6 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">
            Nos équipes en compétition
          </h2>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ocean-deep/80">
            Participation régulière au championnat loisir Volley&apos;Lib. 12 licenciées en Compet&apos;Lib.
            Phase 2 reprise fin février.
          </p>

          <p className="mt-4 max-w-prose font-body text-base leading-relaxed text-ocean-deep/75">
            Les calendriers et résultats sont consultables sur la Fédération Française de Volley-Ball via{" "}
            <Link
              href="https://www.ffvb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ocean-deep underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
            >
              ffvb.org
            </Link>
            .
          </p>

          <div className="mt-8 flex items-end gap-4">
            <div className="font-display text-[140px] leading-none text-accent">12</div>
            <div className="pb-6 font-ui text-xs uppercase tracking-[0.2em] text-ocean-deep/70">
              Licenciées Compet&apos;Lib
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl border border-ocean-deep/10 bg-white p-8 shadow-[0_20px_60px_rgba(13,34,55,0.10)]"
            >
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-wave/10 blur-3xl" />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep/60">Prochain match</div>
                    <div className="mt-2 font-display text-4xl leading-none tracking-wide text-ocean-deep md:text-5xl">
                      Compétition loisir (Volley&apos;Lib)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-ocean-deep/10 bg-sand-light/60 px-5 py-4">
                    <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-ocean-deep/60">Début dans</div>
                    <div className="mt-2 font-display text-3xl leading-none text-accent">{formatCountdown(next, now)}</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-ocean-deep/10 bg-white px-5 py-4">
                    <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-ocean-deep/60">Date</div>
                    <div className="mt-2 text-ocean-deep/80">{formatDateFR(next)}</div>
                  </div>
                  <div className="rounded-2xl border border-ocean-deep/10 bg-white px-5 py-4">
                    <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-ocean-deep/60">Lieu</div>
                    <div className="mt-2 text-ocean-deep/80">COSEC · Lacanau</div>
                  </div>
                  <div className="rounded-2xl border border-ocean-deep/10 bg-white px-5 py-4">
                    <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-ocean-deep/60">Infos</div>
                    <div className="mt-2 text-ocean-deep/80">Calendrier complet sur FFVB</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="https://www.ffvb.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-ocean-deep px-6 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-ocean"
                  >
                    Voir sur FFVB →
                  </Link>
                  <Link
                    href="#join"
                    className="inline-flex rounded-full border border-ocean-deep/10 bg-white px-6 py-3 font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep transition hover:bg-sand-light/60"
                  >
                    Essai gratuit →
                  </Link>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Résultats",
                  body: "Les résultats seront renseignés ici au fil de la saison (format carte, facile à lire sur mobile).",
                },
                {
                  title: "Classements & agenda",
                  body: "Accès direct aux équipes et calendriers via la fédération, pour retrouver rapidement les infos à jour.",
                },
              ].map((c) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="rounded-3xl border border-ocean-deep/10 bg-white p-8 shadow-[0_20px_60px_rgba(13,34,55,0.08)]"
                >
                  <div className="font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep/60">{c.title}</div>
                  <div className="mt-3 text-ocean-deep/75">{c.body}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

