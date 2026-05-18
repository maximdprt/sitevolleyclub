"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-ocean-deep">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        src="/images/hero-video.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep/90 via-ocean-deep/70 to-ocean/50" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-24 pb-16 md:px-10">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm text-foam/80">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Saison 2025-2026 · En cours
          </div>

          <h2 className="font-display text-[clamp(72px,10vw,140px)] leading-[0.88] tracking-wide text-foam">
            LACANAU
            <br />
            <span className="text-accent">VOLLEY</span>
            <br />
            <span className="text-foam/60 text-[clamp(46px,7vw,90px)]">CLUB</span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-foam/75 md:text-lg">
            L&apos;esprit d&apos;équipe. L&apos;ambiance d&apos;été. Une pratique indoor et beach, ouverte à tous les niveaux depuis 2010.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#join"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-foam transition hover:bg-accent-light"
            >
              Essai gratuit →
            </Link>
            <Link
              href="#activities"
              className="rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-foam transition hover:bg-white/15"
            >
              Nos activités
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foam/80">
              <span aria-hidden>📅</span>
              Mardi 20h · COSEC
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foam/80">
              <span aria-hidden>📅</span>
              Jeudi 20h30 · COSEC
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foam/80">
              <span aria-hidden>🏖️</span>
              Samedi 10h · Beach (Ardilouse)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
