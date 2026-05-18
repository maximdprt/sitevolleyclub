"use client";

import Link from "next/link";
import { useMemo } from "react";

const steps = [
  { num: "01", title: "Venez à un entraînement", desc: "Mardi 20h / Jeudi 20h30 · COSEC Lacanau" },
  { num: "02", title: "Essayez gratuitement", desc: "1re séance sans inscription, sans engagement" },
  { num: "03", title: "Adhérez !", desc: "30 € salle ou beach · Paiement sur place" },
] as const;

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

function toGoogleDateUTC(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildGoogleCalendarUrl({ start, end }: { start: Date; end: Date }) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Essai gratuit — Lacanau Volley",
    dates: `${toGoogleDateUTC(start)}/${toGoogleDateUTC(end)}`,
    details: "Venez essayer gratuitement (sans inscription).",
    location: "COSEC, 19 Av. Albert François, 33680 Lacanau",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs({ start, end }: { start: Date; end: Date }) {
  const dtstamp = toGoogleDateUTC(new Date()).replace("Z", "");
  const dtStart = toGoogleDateUTC(start).replace("Z", "");
  const dtEnd = toGoogleDateUTC(end).replace("Z", "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lacanau Volley//FR", "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:lacanau-volley-essai-${start.getTime()}@lacanau-volley`,
    `DTSTAMP:${dtstamp}Z`, `DTSTART:${dtStart}Z`, `DTEND:${dtEnd}Z`,
    "SUMMARY:Essai gratuit — Lacanau Volley",
    "LOCATION:COSEC, 19 Av. Albert François, 33680 Lacanau",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "essai-lacanau-volley.ics";
  document.body.appendChild(a); a.click(); a.remove();
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
    <section id="join" className="bg-sand-light py-20 text-ocean-deep">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-wave">Rejoindre le club</div>
        <h2 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">Rejoindre le club</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ocean-deep/70 md:text-lg">
          1re séance 100% gratuite — venez essayer sans engagement ni inscription préalable.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="rounded-xl border border-ocean-deep/10 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-ocean-deep">{s.title}</div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent font-display text-xl leading-none text-foam">
                  {s.num}
                </div>
              </div>
              <div className="mt-3 text-sm text-ocean-deep/65">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={buildGoogleCalendarUrl(nextTraining)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-ocean-deep px-6 py-3 text-sm font-semibold text-foam transition hover:bg-ocean"
          >
            Ajouter à Google Agenda →
          </a>
          <button
            type="button"
            onClick={() => downloadIcs(nextTraining)}
            className="rounded-xl border border-ocean-deep/15 bg-white px-6 py-3 text-sm font-semibold text-ocean-deep transition hover:bg-sand"
          >
            Télécharger (.ics)
          </button>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="rounded-xl border border-ocean-deep/10 bg-white p-6">
            <div className="text-sm font-semibold text-accent">🎉 Bonne nouvelle</div>
            <div className="mt-2 text-ocean-deep/75">
              <strong>1re séance 100% gratuite</strong> — venez essayer sans engagement, sans inscription préalable.
            </div>
          </div>

          <div className="rounded-xl bg-ocean-deep p-6 text-foam">
            <div className="text-xs font-semibold uppercase tracking-widest text-sand-light/60">Tarifs saison 2025-2026</div>
            <div className="mt-4 space-y-4">
              {[
                { label: "Volley indoor", sub: "Septembre → Mai", price: "30 €" },
                { label: "Beach volley", sub: "Mai → Octobre", price: "30 €" },
                { label: "Tournois ponctuels", sub: "6 juin · 12 juil. · 2 août", price: "2 €" },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between border-b border-white/8 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="text-sm font-semibold text-foam">{t.label}</div>
                    <div className="text-xs text-foam/50">{t.sub}</div>
                  </div>
                  <div className="font-display text-3xl text-accent">{t.price}</div>
                </div>
              ))}
            </div>
            <Link
              href="#contact"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-foam transition hover:bg-accent-light"
            >
              Nous contacter →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
