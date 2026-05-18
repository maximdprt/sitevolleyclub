"use client";

import { CounterStat } from "@/components/ui/CounterStat";

const stats = [
  { value: 40, label: "Adhérents" },
  { value: 12, label: "Licenciées Compet'Lib" },
  { value: 2010, label: "Année de création" },
  { value: 1000, label: "Abonnés Facebook", suffix: "+" },
];

export function Stats() {
  return (
    <section className="bg-ocean-deep border-t border-white/8">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <CounterStat value={s.value} suffix={s.suffix} />
              <div className="mt-1 text-sm text-foam/55">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
