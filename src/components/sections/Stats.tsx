"use client";

import { CounterStat } from "@/components/ui/CounterStat";
import { WaveDivider } from "@/components/ui/WaveDivider";

const stats: { value: number; label: string; suffix?: string }[] = [
  { value: 40, label: "Adhérents" },
  { value: 12, label: "Licenciées Compet'Lib" },
  { value: 2010, label: "Année de création" },
  { value: 1000, label: "Abonnés Facebook", suffix: "+" },
];

export function Stats() {
  return (
    <section className="bg-ocean-deep">
      <WaveDivider color="var(--sand-light)" />
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="relative">
              <CounterStat value={s.value} suffix={s.suffix} />
              <div className="mt-3 font-ui text-[11px] uppercase tracking-[0.2em] text-(--sand-light)/80">
                {s.label}
              </div>
              <div className="pointer-events-none absolute -right-5 top-2 hidden h-16 w-px bg-wave/30 lg:block" />
            </div>
          ))}
        </div>
      </div>
      <WaveDivider color="var(--sand-light)" flipY />
    </section>
  );
}

