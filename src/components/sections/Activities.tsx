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
            Indoor le jeudi soir, beach le samedi matin. Tournois, convivialité, et esprit d’équipe.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <motion.div
            whileHover={{ rotateY: 5, rotateX: -3, translateZ: 20, scale: 1.02 }}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
            className="rounded-3xl border border-white/10 bg-ocean-deep p-10"
          >
            <motion.div
              aria-hidden
              className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            >
              🏐
            </motion.div>
            <h3 className="font-display text-7xl leading-none text-foam">INDOOR</h3>
            <div className="mt-1 font-ui text-xs uppercase tracking-[0.2em] text-sand-light/80">
              Volley en salle
            </div>

            <div className="mt-8 space-y-3 text-foam/85">
              <div>
                <span className="font-ui text-xs uppercase tracking-[0.18em] text-sand-light/70">📅</span>{" "}
                Tous les jeudis · 20h30 → 23h00
              </div>
              <div>
                <span className="font-ui text-xs uppercase tracking-[0.18em] text-sand-light/70">📍</span>{" "}
                Salle Cosec · 19 Av. Albert François · 33680 Lacanau
              </div>
              <div>
                <span className="font-ui text-xs uppercase tracking-[0.18em] text-sand-light/70">💰</span>{" "}
                30 € / saison
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Loisir", "Mixte", "Tous niveaux", "Compet'Lib"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-ui text-[11px] uppercase tracking-[0.18em] text-foam/85"
                >
                  {t}
                </span>
              ))}
            </div>

            <a
              href="#join"
              className="mt-10 inline-flex rounded-full border border-foam/40 bg-white/5 px-6 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-white/10"
            >
              Rejoindre le club →
            </a>
          </motion.div>

          <motion.div
            whileHover={{ rotateY: -5, rotateX: -3, translateZ: 20, scale: 1.02 }}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
            className="rounded-3xl border border-ocean-deep/10 bg-sand p-10 text-ocean-deep"
          >
            <motion.div
              aria-hidden
              className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-deep/10"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
            >
              🌊
            </motion.div>
            <h3 className="font-display text-7xl leading-none">BEACH</h3>
            <div className="mt-1 font-ui text-xs uppercase tracking-[0.2em] text-ocean-deep/70">
              Volley de plage
            </div>

            <div className="mt-8 space-y-3 text-ocean-deep/80">
              <div>
                <span className="font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep/60">📅</span>{" "}
                Tous les samedis · 10h00 → 12h30 · Moutchic / Ardilouse
              </div>
              <div>
                <span className="font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep/60">🏆</span>{" "}
                Tournois chaque 1er samedi · 2 € / joueur
              </div>
              <div>
                <span className="font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep/60">💰</span>{" "}
                30 € / saison (Mai → Octobre)
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Mai–Octobre", "Tournois", "Convivial"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-ocean-deep/10 bg-white/40 px-3 py-1 font-ui text-[11px] uppercase tracking-[0.18em] text-ocean-deep/80"
                >
                  {t}
                </span>
              ))}
            </div>

            <a
              href="#join"
              className="mt-10 inline-flex rounded-full bg-ocean-deep px-6 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-ocean"
            >
              Rejoindre le club →
            </a>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 rounded-3xl bg-accent px-8 py-6 text-center font-display text-3xl tracking-wide text-foam md:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          🏆 Tournois du jeudi soir &nbsp;|&nbsp; Juin → Août &nbsp;|&nbsp; 2 €/joueur &nbsp;|&nbsp; Avec Cap 33
        </motion.div>
      </div>
    </section>
  );
}

