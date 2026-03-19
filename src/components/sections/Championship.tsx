"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const rows = [
  { date: "À venir", adversaire: "–", lieu: "–", score: "–" },
  { date: "À venir", adversaire: "–", lieu: "–", score: "–" },
] as const;

export function Championship() {
  return (
    <section id="championship" className="bg-foam py-20 text-ocean-deep">
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 md:px-8 lg:grid-cols-[1fr_1fr]">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-ocean-deep/10 bg-white px-5 py-2 font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep">
            <span className="relative inline-flex h-2 w-2">
              <motion.span
                className="absolute inset-0 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            </span>
            LIVE — Saison en cours
          </div>

          <h2 className="mt-6 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">
            Nos équipes en compétition
          </h2>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ocean-deep/80">
            Participation régulière au championnat loisir Volley&apos;Lib. 12 licenciées en Compet&apos;Lib.
            Phase 2 reprise fin février.
          </p>

          <div className="mt-8 flex items-end gap-4">
            <div className="font-display text-[140px] leading-none text-accent">12</div>
            <div className="pb-6 font-ui text-xs uppercase tracking-[0.2em] text-ocean-deep/70">
              Licenciées Compet&apos;Lib
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-ocean-deep/10 bg-white shadow-[0_20px_60px_rgba(13,34,55,0.10)]">
            <table className="w-full text-left">
              <thead className="bg-ocean text-foam">
                <tr>
                  <th className="px-6 py-4 font-ui text-xs uppercase tracking-[0.18em]">Date</th>
                  <th className="px-6 py-4 font-ui text-xs uppercase tracking-[0.18em]">Adversaire</th>
                  <th className="px-6 py-4 font-ui text-xs uppercase tracking-[0.18em]">Lieu</th>
                  <th className="px-6 py-4 font-ui text-xs uppercase tracking-[0.18em]">Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <motion.tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-(--sand-light)/60" : "bg-white"}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 + idx * 0.08 }}
                  >
                    <td className="px-6 py-4 text-ocean-deep/80">{r.date}</td>
                    <td className="px-6 py-4 text-ocean-deep/80">{r.adversaire}</td>
                    <td className="px-6 py-4 text-ocean-deep/80">{r.lieu}</td>
                    <td className="px-6 py-4 text-ocean-deep/80">{r.score}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-ocean-deep/10 px-6 py-6 text-ocean-deep/70">
              <div className="font-body italic">🏆 Les résultats seront mis à jour ici</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

