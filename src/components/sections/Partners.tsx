"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Partners() {
  return (
    <section id="partners" className="bg-ocean text-foam">
      <WaveDivider color="var(--ocean)" />
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <ScrollReveal className="text-center">
          <h2 className="font-display text-7xl leading-[0.9] tracking-wide md:text-8xl">Ils nous soutiennent</h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <motion.div
            whileHover={{ y: -8 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-center rounded-2xl bg-white p-4">
              <Image
                src="/images/logo-lacanau.jpg"
                alt="Ville de Lacanau"
                width={300}
                height={160}
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="mt-6 text-center font-ui text-xs uppercase tracking-[0.18em] text-(--sand-light)/80">
              Ville de Lacanau
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-center rounded-2xl bg-white p-4">
              <Image
                src="/images/logo-ffvolley.png"
                alt="FF Volley"
                width={300}
                height={160}
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="mt-6 text-center font-ui text-xs uppercase tracking-[0.18em] text-(--sand-light)/80">
              Comité de Gironde de Volley Ball
            </div>
          </motion.div>
        </div>

        <div className="mt-10 rounded-3xl bg-ocean-deep/60 p-10 text-center">
          <p className="mx-auto max-w-3xl font-body text-lg leading-relaxed text-foam/85">
            Votre logo sur nos maillots, bannières lors des matchs, visibilité sur nos réseaux (1000+ abonnés). Contactez-nous
            pour une collaboration sur-mesure.
          </p>
          <div className="mt-8">
            <Link
              href="#contact"
              data-cursor="hover"
              className="inline-flex rounded-full bg-accent px-7 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-foam hover:text-ocean-deep"
            >
              Devenir partenaire →
            </Link>
          </div>
        </div>
      </div>
      <WaveDivider color="var(--ocean)" flipY />
    </section>
  );
}

