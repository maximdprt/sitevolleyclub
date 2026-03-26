"use client";

import { CounterStat } from "@/components/ui/CounterStat";

type KpiIcon = "users" | "team" | "calendar" | "reach";

const stats: { value: number; label: string; suffix?: string; icon: KpiIcon }[] = [
  { value: 40, label: "Adhérents", icon: "users" },
  { value: 12, label: "Licenciées Compet'Lib", icon: "team" },
  { value: 2010, label: "Année de création", icon: "calendar" },
  { value: 1000, label: "Abonnés Facebook", suffix: "+", icon: "reach" },
];

function KpiBadge({ icon }: { icon: KpiIcon }) {
  return (
    <div
      aria-hidden
      className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-foam/90 shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur"
    >
      {icon === "users" ? (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
          <path d="M4 20c1.8-3.2 5-5 8-5s6.2 1.8 8 5" strokeLinecap="round" />
          <path d="M18 8.8c1.3.6 2.2 2 2.2 3.6" strokeLinecap="round" opacity="0.6" />
        </svg>
      ) : icon === "team" ? (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
          <path d="M21 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
          <path d="M15 10a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0Z" opacity="0.9" />
          <path d="M2.5 20c1-2.3 2.8-3.6 5-3.6" strokeLinecap="round" opacity="0.65" />
          <path d="M21.5 20c-1-2.3-2.8-3.6-5-3.6" strokeLinecap="round" opacity="0.65" />
          <path d="M6.2 20c1.5-3 3.9-4.6 5.8-4.6s4.3 1.6 5.8 4.6" strokeLinecap="round" />
        </svg>
      ) : icon === "calendar" ? (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 3v3M17 3v3" strokeLinecap="round" />
          <path d="M4.5 7.5h15" strokeLinecap="round" opacity="0.7" />
          <path
            d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
            strokeLinejoin="round"
          />
          <path d="M8 12h3M8 15h6" strokeLinecap="round" opacity="0.85" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 17l4-6 4 3 4-7 4 5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 20h16" strokeLinecap="round" opacity="0.6" />
          <path d="M7 20v-3" strokeLinecap="round" opacity="0.7" />
          <path d="M12 20v-6" strokeLinecap="round" opacity="0.7" />
          <path d="M17 20v-4" strokeLinecap="round" opacity="0.7" />
        </svg>
      )}
    </div>
  );
}

export function Stats() {
  return (
    <section className="bg-ocean-deep">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/6 via-white/0 to-accent/8 opacity-80"
              />
              <div aria-hidden className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-wave/15 blur-2xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-accent/15 blur-2xl" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-3">
                    <KpiBadge icon={s.icon} />
                    <div className="min-w-0">
                      <div className="font-ui text-[11px] uppercase tracking-[0.22em] text-sand-light/80">
                        {s.label}
                      </div>
                      <div className="mt-1 h-px w-10 bg-wave/35" />
                    </div>
                  </div>
                  <CounterStat value={s.value} suffix={s.suffix} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

