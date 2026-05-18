"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Club() {
  return (
    <section id="club" className="bg-sand-light py-20 text-ocean-deep">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:px-10 lg:grid-cols-2">
        <ScrollReveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-wave">Notre histoire</div>
          <h2 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide text-ocean-deep md:text-7xl">
            Passion, Loisir &amp; Convivialité
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ocean-deep/75 md:text-lg">
            L&apos;AS Lacanau Section Volley Ball est née le 30 juin 2010. Notre mission : promouvoir le volley-ball loisir,
            favoriser l&apos;inclusion et le bien-être de tous. Entre forêt landaise et océan Atlantique, nous allions convivialité,
            passion du sport et esprit d&apos;équipe.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-ocean-deep/10 px-4 py-1.5 text-sm font-medium text-ocean-deep">Fondé en 2010</span>
            <span className="rounded-full bg-ocean-deep/10 px-4 py-1.5 text-sm font-medium text-ocean-deep">40 adhérents</span>
            <span className="rounded-full bg-ocean-deep/10 px-4 py-1.5 text-sm font-medium text-ocean-deep">Tous niveaux</span>
          </div>

          <div className="mt-8 rounded-xl border border-ocean-deep/12 bg-white p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-deep text-foam text-lg">
                🛡️
              </div>
              <div>
                <div className="font-medium text-ocean-deep">Sébastien Duprat — Président</div>
                <div className="mt-1 text-sm text-ocean-deep/65">
                  <a href="tel:0634432002" className="hover:text-ocean underline underline-offset-4 decoration-accent/40">06 34 43 20 02</a>
                  {" · "}
                  <a href="mailto:contact@lacanauvolley.fr" className="hover:text-ocean underline underline-offset-4 decoration-accent/40">contact@lacanauvolley.fr</a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="overflow-hidden rounded-xl">
            <img
              src="/images/team-1.jpg"
              alt="Équipe AS Lacanau Volley"
              className="h-[420px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
