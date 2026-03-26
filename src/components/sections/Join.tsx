"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useMemo } from "react";

const steps = [
  { num: "01", title: "Venez à un entraînement", desc: "Jeudi soir à 20h30 · Salle Cosec Lacanau" },
  { num: "02", title: "Essayez gratuitement", desc: "1ère séance sans inscription, sans engagement" },
  { num: "03", title: "Adhérez !", desc: "30€ salle ou 30€ beach · Paiement sur place" },
] as const;

function getNextThursdayAt2030(now = new Date()) {
  const d = new Date(now);
  d.setSeconds(0, 0);
  const day = d.getDay(); // 0..6
  const daysUntilThursday = (4 - day + 7) % 7;
  d.setDate(d.getDate() + daysUntilThursday);
  d.setHours(20, 30, 0, 0);
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 7);
  return d;
}

function toGoogleDateUTC(d: Date) {
  // Google template works well with UTC timestamps ended with Z.
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildGoogleCalendarUrl({ start, end }: { start: Date; end: Date }) {
  const text = "Essai gratuit — Lacanau Volley";
  const details =
    "Venez essayer gratuitement (sans inscription).\\n\\nIndoor: jeudi 20h30–23h00\\nAdresse: COSEC, 19 Av. Albert François, 33680 Lacanau";
  const location = "COSEC, 19 Av. Albert François, 33680 Lacanau";
  const dates = `${toGoogleDateUTC(start)}/${toGoogleDateUTC(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    dates,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs({ start, end }: { start: Date; end: Date }) {
  const dtstamp = toGoogleDateUTC(new Date()).replace("Z", "");
  const dtStart = toGoogleDateUTC(start).replace("Z", "");
  const dtEnd = toGoogleDateUTC(end).replace("Z", "");
  const uid = `lacanau-volley-essai-${start.getTime()}@lacanau-volley`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lacanau Volley//Essai//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}Z`,
    `DTSTART:${dtStart}Z`,
    `DTEND:${dtEnd}Z`,
    "SUMMARY:Essai gratuit — Lacanau Volley",
    "LOCATION:COSEC, 19 Av. Albert François, 33680 Lacanau",
    "DESCRIPTION:Venez essayer gratuitement (sans inscription).\\n\\nIndoor: jeudi 20h30–23h00",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "essai-gratuit-lacanau-volley.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function Join() {
  const nextTraining = useMemo(() => {
    const start = getNextThursdayAt2030();
    const end = new Date(start);
    end.setHours(23, 0, 0, 0);
    return { start, end };
  }, []);

  return (
    <section id="join" className="relative overflow-hidden bg-sand-light py-20 text-ocean-deep">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/team-2.jpg"
          alt=""
          fill
          className="object-cover opacity-10 blur-sm"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 md:px-8 lg:grid-cols-[1fr_420px]">
        <ScrollReveal>
          <h2 className="font-display text-7xl leading-[0.9] tracking-wide md:text-8xl">Rejoindre le club</h2>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-ocean-deep/80">
            1ère séance 100% gratuite — venez essayer sans engagement, sans inscription préalable.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={buildGoogleCalendarUrl(nextTraining)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-ocean-deep px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-ocean"
            >
              Ajouter à Google Calendar →
            </a>
            <button
              type="button"
              onClick={() => downloadIcs(nextTraining)}
              className="inline-flex rounded-full border border-ocean-deep/15 bg-white px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep transition hover:bg-sand"
            >
              Télécharger l&apos;évènement (.ics)
            </button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map((s, idx) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.08 }}
                className="relative overflow-hidden rounded-3xl border border-ocean-deep/10 bg-white p-7 shadow-[0_20px_60px_rgba(13,34,55,0.08)]"
              >
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-wave/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-ui text-xs uppercase tracking-[0.2em] text-ocean-deep/70">{s.title}</div>
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-accent font-display text-2xl leading-none text-foam">
                      {s.num}
                    </div>
                  </div>
                  <div className="mt-4 text-ocean-deep/80">{s.desc}</div>
                  {idx < steps.length - 1 ? (
                    <div className="mt-6 hidden h-px w-full bg-ocean-deep/10 lg:block" aria-hidden />
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border-l-4 border-accent bg-white p-6 shadow-[0_20px_60px_rgba(13,34,55,0.10)]">
            <div className="font-body text-ocean-deep/80">
              🎉 <strong>1ère séance 100% gratuite</strong> — Venez essayer sans engagement, sans inscription préalable.
            </div>
          </div>
        </ScrollReveal>

        <motion.div
          className="relative overflow-hidden rounded-3xl bg-ocean-deep p-10 text-foam shadow-[0_30px_90px_rgba(13,34,55,0.25)]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="font-ui text-xs uppercase tracking-[0.2em] text-sand-light/80">
            Tarifs saison 2025-2026
          </div>
          <div className="mt-6 space-y-6">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="font-ui text-xs uppercase tracking-[0.18em] text-sand-light/80">🏐 Volley indoor</div>
                <div className="mt-2 text-sm text-foam/75">(Septembre → Mai)</div>
              </div>
              <div className="font-display text-4xl text-accent">30 €</div>
            </div>
            <div className="h-px bg-wave/30" />
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="font-ui text-xs uppercase tracking-[0.18em] text-sand-light/80">🏖️ Beach volley</div>
                <div className="mt-2 text-sm text-foam/75">(Mai → Octobre)</div>
              </div>
              <div className="font-display text-4xl text-accent">30 €</div>
            </div>
            <div className="h-px bg-wave/30" />
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="font-ui text-xs uppercase tracking-[0.18em] text-sand-light/80">🎯 Tournois ponctuels</div>
                <div className="mt-2 text-sm text-foam/75">(Jeudi soir Juin-Août / 1er samedi)</div>
              </div>
              <div className="font-display text-4xl text-accent">2 €</div>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="#contact"
              data-cursor="hover"
              className="inline-flex rounded-full bg-accent px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-foam hover:text-ocean-deep"
            >
              Nous contacter →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

