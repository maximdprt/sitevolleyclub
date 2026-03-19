"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedText } from "@/components/ui/AnimatedText";

export function Hero() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden bg-ocean-deep">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
        src="/images/hero-video.mp4"
      />
      <div className="absolute inset-0 bg-linear-to-br from-ocean-deep/80 via-ocean/50 to-accent/20" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 pt-24 md:px-8">
        <motion.div
          className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 font-ui text-xs uppercase tracking-[0.18em] text-foam backdrop-blur-md"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        >
          <span aria-hidden>🏐</span>
          Saison 2025-2026 · En cours
        </motion.div>

        <div className="hero-title">
          <div className="font-display leading-[0.85] tracking-wide text-foam text-balance">
            <div className="text-[clamp(80px,12vw,160px)]">
              <AnimatedText text="LACANAU" />
            </div>
            <div className="text-[clamp(80px,12vw,160px)] text-accent [text-shadow:0_0_80px_rgba(232,97,10,0.4)]">
              <AnimatedText text="VOLLEY" />
            </div>
            <div className="text-[clamp(50px,8vw,100px)] text-foam/70">
              <AnimatedText text="CLUB" />
            </div>
          </div>
        </div>

        <motion.p
          className="mt-8 max-w-3xl font-ui text-xs uppercase tracking-[0.25em] text-sand-light/80"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
        >
          Entre océan et forêt · Indoor &amp; Beach · Depuis 2010
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: "easeOut" }}
        >
          <Link
            href="#join"
            data-cursor="hover"
            className="rounded-full bg-accent px-8 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-foam hover:text-ocean-deep"
          >
            Venez nous rejoindre →
          </Link>
          <Link
            href="#activities"
            data-cursor="hover"
            className="rounded-full border border-foam/40 bg-white/5 px-8 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam backdrop-blur transition hover:bg-white/10"
          >
            Voir nos activités
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
            <span aria-hidden>📅</span>
            <span className="font-ui text-xs uppercase tracking-[0.18em] text-foam">JEUDI 20H30 · COSEC</span>
          </div>
          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
            <span aria-hidden>🏖️</span>
            <span className="font-ui text-xs uppercase tracking-[0.18em] text-foam">SAMEDI 10H · BEACH</span>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-sand-light/80">
            Découvrir
          </div>
          <div className="mt-2 text-foam/80">⌄</div>
        </motion.div>
      </div>
    </section>
  );
}

