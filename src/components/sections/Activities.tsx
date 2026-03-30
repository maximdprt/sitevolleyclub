"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Activities() {
  return (
    <section id="activities" className="bg-ocean py-20 text-foam">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <h2 className="font-display text-7xl leading-[0.9] tracking-wide md:text-8xl">Nos activités</h2>
          <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-foam/80">
            Indoor le mardi et jeudi soir, beach le dimanche matin. Tournois, convivialité, et esprit d’équipe.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:auto-rows-[1fr]">
          <motion.a
            href="#join"
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ocean-deep p-10 lg:col-span-2"
          >
            <img
              src="/images/team-1.jpg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:opacity-25"
              loading="lazy"
              decoding="async"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-br from-ocean-deep/85 via-ocean-deep/55 to-accent/20" />
            <div aria-hidden className="pointer-events-none absolute -bottom-14 -right-14 h-64 w-64 rounded-full bg-wave/20 blur-3xl transition duration-500 group-hover:bg-wave/25" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.2em] text-sand-light/80 backdrop-blur">
                <span aria-hidden>🏐</span> Indoor
              </div>
              <div className="mt-6 font-display text-7xl leading-none tracking-wide text-foam md:text-8xl">Mardi & jeudi soir</div>
              <div className="mt-3 max-w-xl text-lg leading-relaxed text-foam/80">
                Salle, tous niveaux, esprit d’équipe. Compet&apos;Lib pour celles et ceux qui veulent se challenger.
              </div>

              <div className="mt-8 grid gap-3 text-foam/85 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                  <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-sand-light/70">Horaire</div>
                  <div className="mt-2">
                    Mardi 20h00 → 23h00
                    <br />
                    Jeudi 20h30 → 23h00
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                  <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-sand-light/70">Adresse</div>
                  <div className="mt-2">COSEC · 19 Av. Albert François</div>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-foam/40 bg-white/5 px-6 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam backdrop-blur transition group-hover:bg-white/10">
                Découvrir la section →
              </div>
            </div>
          </motion.a>

          <motion.a
            href="#join"
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-sand p-10 text-ocean-deep"
          >
            <img
              src="/images/team-3.jpg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 transition duration-500 group-hover:opacity-20"
              loading="lazy"
              decoding="async"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-br from-sand/92 via-sand/75 to-wave/20" />
            <div aria-hidden className="pointer-events-none absolute -top-12 -left-12 h-56 w-56 rounded-full bg-accent/15 blur-3xl transition duration-500 group-hover:bg-accent/20" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-ocean-deep/10 bg-white/45 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.2em] text-ocean-deep/70 backdrop-blur">
                <span aria-hidden>🏖️</span> Beach
              </div>
              <div className="mt-6 font-display text-7xl leading-none tracking-wide md:text-8xl">Dimanche</div>
              <div className="mt-3 text-lg leading-relaxed text-ocean-deep/75">
                Sable, soleil et convivialité. Saison beach de mai à octobre.
              </div>
              <div className="mt-8 rounded-2xl border border-ocean-deep/10 bg-white/55 px-5 py-4 backdrop-blur">
                <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-ocean-deep/60">Horaire</div>
                <div className="mt-2">10h00 → 12h30 · Ardilouse</div>
              </div>
              <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-ocean-deep px-6 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam transition group-hover:bg-ocean">
                Découvrir la section →
              </div>
            </div>
          </motion.a>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl lg:col-span-3">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="font-ui text-[11px] uppercase tracking-[0.2em] text-sand-light/75">Tarifs</div>
                <div className="mt-3 font-display text-5xl leading-none tracking-wide text-foam md:text-6xl">
                  30€ / saison
                </div>
                <div className="mt-3 text-foam/75">
                  Une formule simple, accessible, pensée pour venir jouer régulièrement dans la bonne humeur
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[520px]">
                {[
                  "Accès tous niveaux",
                  "Tournois & rencontres",
                  "Matériel inclus",
                  "Ambiance conviviale",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <span aria-hidden className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-foam">
                      ✓
                    </span>
                    <div className="font-ui text-xs uppercase tracking-[0.18em] text-foam/85">{t}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#join"
                className="inline-flex rounded-full bg-accent px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-foam hover:text-ocean-deep"
              >
                Essai gratuit →
              </a>
              <a
                href="#contact"
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam backdrop-blur transition hover:bg-white/10"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-10 rounded-3xl bg-accent px-8 py-6 text-center font-display text-3xl tracking-wide text-foam md:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          🏆 Tournoi le mercredi soir à partir de 20h30 &nbsp;|&nbsp; Juillet → Août &nbsp;|&nbsp; 2 €/joueur &nbsp;|&nbsp; Avec Cap 33
        </motion.div>
      </div>
    </section>
  );
}

