"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Club() {
  return (
    <section id="club" className="relative overflow-hidden bg-sand-light text-text-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="font-display text-[220px] leading-none text-sand/20 md:text-[260px]">VOLLEY</div>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 md:px-8 lg:grid-cols-[55%_45%]">
        <ScrollReveal className="relative z-10">
          <div className="font-ui text-xs uppercase tracking-[0.2em] text-wave">Notre histoire</div>
          <h2 className="mt-4 font-display text-6xl leading-[0.9] text-ocean-deep md:text-7xl">
            Passion, Loisir &amp; Convivialité
          </h2>
          <p className="mt-6 max-w-prose text-[17px] leading-[1.8] text-text-dark/80">
            L&apos;AS Lacanau Section Volley Ball est née le 30 juin 2010. Notre mission : promouvoir le volley-ball loisir,
            favoriser l&apos;inclusion et le bien-être de tous. Entre forêt landaise et océan Atlantique, nous allions convivialité,
            passion du sport et esprit d&apos;équipe. Que vous soyez débutant ou expérimenté, vous trouverez ici un environnement chaleureux.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-wave px-4 py-2 font-ui text-xs uppercase tracking-[0.18em] text-foam">
              Fondé en 2010
            </span>
            <span className="rounded-full border border-wave/30 bg-white/60 px-4 py-2 font-ui text-xs uppercase tracking-[0.18em] text-ocean-deep backdrop-blur">
              40 adhérents
            </span>
          </div>

          <div className="mt-10 rounded-3xl bg-sand p-6 shadow-[0_20px_60px_rgba(13,34,55,0.12)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-deep text-foam">
                🛡️
              </div>
              <div>
                <div className="font-body italic text-text-dark/80">David Da Costa — Président</div>
                <div className="mt-2 text-sm text-text-dark/70">
                  Contact :{" "}
                  <a className="font-medium text-ocean underline decoration-accent/50 underline-offset-4" href="tel:0695043114">
                    06 95 04 31 14
                  </a>{" "}
                  ·{" "}
                  <a className="font-medium text-ocean underline decoration-accent/50 underline-offset-4" href="mailto:david.lacanau33@orange.fr">
                    david.lacanau33@orange.fr
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <Image
                src="/images/logo-lacanau.jpg"
                alt="Ville de Lacanau"
                width={160}
                height={80}
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <Image
                src="/images/logo-ffvolley.png"
                alt="Comité de Gironde de Volley Ball"
                width={160}
                height={80}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="relative z-10" delay={0.1}>
          <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_90px_rgba(13,34,55,0.25)] -rotate-2">
            <Image
              src="/images/team-1.jpg"
              alt="Équipe AS Lacanau Volley"
              width={1200}
              height={900}
              className="h-[520px] w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-foam backdrop-blur-xl">
              <div className="font-ui text-xs uppercase tracking-[0.2em]">40 adhérents • Mixte • Tous niveaux</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

