"use client";

import Link from "next/link";
import { AnimatedText } from "@/components/ui/AnimatedText";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-ocean-deep">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-luminosity"
        src="/images/hero-video.mp4"
      />
      <div className="absolute inset-0 bg-linear-to-br from-ocean-deep/80 via-ocean/50 to-accent/20" />
      <div aria-hidden className="absolute inset-0 bg-radial-[circle_at_20%_15%] from-accent/14 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pt-24 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 font-ui text-xs uppercase tracking-[0.18em] text-foam backdrop-blur-md">
            <span aria-hidden>🏐</span>
            Saison 2025-2026 · En cours
          </div>

          <div className="hero-title">
            <div className="font-display leading-[0.85] tracking-wide text-foam text-balance">
              <div className="text-[clamp(76px,10vw,150px)]">
                <AnimatedText text="LACANAU" />
              </div>
              <div className="text-[clamp(76px,10vw,150px)] text-accent [text-shadow:0_0_80px_rgba(232,97,10,0.4)]">
                <AnimatedText text="VOLLEY" />
              </div>
              <div className="text-[clamp(46px,7vw,92px)] text-foam/70">
                <AnimatedText text="CLUB" />
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-2xl font-ui text-xs uppercase tracking-[0.25em] text-sand-light/80">
            Entre océan et forêt · Indoor &amp; Beach · Depuis 2010
          </p>

          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-foam/80">
            L’esprit d’équipe. L’air marin. Une pratique indoor &amp; beach, ouverte à tous les niveaux.
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#join"
              data-cursor="hover"
              className="rounded-full bg-accent px-8 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-foam hover:text-ocean-deep"
            >
              Essai gratuit →
            </Link>
            <Link
              href="#activities"
              data-cursor="hover"
              className="rounded-full border border-foam/40 bg-white/5 px-8 py-4 font-ui text-xs uppercase tracking-[0.18em] text-foam backdrop-blur transition hover:bg-white/10"
            >
              Voir nos activités
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
              <span aria-hidden>📅</span>
              <span className="font-ui text-xs uppercase tracking-[0.18em] text-foam">JEUDI 20H30 · COSEC</span>
            </div>
            <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
              <span aria-hidden>🏖️</span>
              <span className="font-ui text-xs uppercase tracking-[0.18em] text-foam">SAMEDI 10H · BEACH</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="ml-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
            <div className="font-ui text-[11px] uppercase tracking-[0.18em] text-sand-light/70">À la une</div>
            <div className="mt-4 font-display text-5xl leading-[0.95] tracking-wide text-foam">
              Esprit d’équipe.
              <br />
              Air marin.
              <br />
              Convivialité.
            </div>
            <div className="mt-4 text-foam/75">
              Rejoignez l’AS Lacanau Section Volley Ball — indoor le jeudi, beach le samedi.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

