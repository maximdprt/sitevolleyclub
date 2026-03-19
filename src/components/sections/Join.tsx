"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  { num: "01", title: "Venez à un entraînement", desc: "Jeudi soir à 20h30 · Salle Cosec Lacanau" },
  { num: "02", title: "Essayez gratuitement", desc: "1ère séance sans inscription, sans engagement" },
  { num: "03", title: "Adhérez !", desc: "30€ salle ou 30€ beach · Paiement sur place" },
] as const;

export function Join() {
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
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-7xl leading-[0.9] tracking-wide md:text-8xl">Rejoindre le club</h2>
            <Image
              src="/images/LVB1.png"
              alt="Logo AS Lacanau Volley Ball"
              width={112}
              height={112}
              className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
              loading="lazy"
            />
          </div>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-ocean-deep/80">
            1ère séance 100% gratuite — venez essayer sans engagement, sans inscription préalable.
          </p>

          <div className="mt-10 space-y-8">
            {steps.map((s, idx) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.12 }}
                className="relative pl-14"
              >
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-2xl text-foam">
                  {s.num}
                </div>
                {idx < steps.length - 1 ? (
                  <div className="absolute left-5 top-10 h-10 w-px bg-wave/30" aria-hidden />
                ) : null}
                <div className="font-ui text-xs uppercase tracking-[0.2em] text-ocean-deep/70">{s.title}</div>
                <div className="mt-2 text-ocean-deep/80">{s.desc}</div>
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
            Tarifs saison 2024-2025
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

