"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Activities() {
  return (
    <section id="activities" className="bg-ocean py-20 text-foam">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <ScrollReveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-sand-light/70">Nos activités</div>
          <h2 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">
            Indoor & Beach
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foam/75">
            Volley en salle le mardi et jeudi soir, beach le samedi matin. Tournois, convivialité, esprit d&apos;équipe.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* Indoor */}
          <div className="relative overflow-hidden rounded-xl bg-ocean-deep">
            <img
              src="/images/team-1.jpg"
              alt="Volley indoor"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
              loading="lazy"
            />
            <div className="relative p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm">
                <span aria-hidden>🏐</span> Indoor
              </div>
              <h3 className="mt-5 font-display text-5xl leading-none tracking-wide text-foam md:text-6xl">
                Mardi & Jeudi soir
              </h3>
              <p className="mt-3 text-foam/70">Salle, tous niveaux, esprit d&apos;équipe.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/8 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-foam/50">Horaire</div>
                  <div className="mt-1 text-sm text-foam">Mardi 20h – 23h<br />Jeudi 20h30 – 23h</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/8 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-foam/50">Lieu</div>
                  <div className="mt-1 text-sm text-foam">COSEC · 19 Av. Albert François</div>
                </div>
              </div>
            </div>
          </div>

          {/* Beach */}
          <div className="relative overflow-hidden rounded-xl bg-sand">
            <img
              src="/images/team-3.jpg"
              alt="Beach volley"
              className="absolute inset-0 h-full w-full object-cover opacity-20"
              loading="lazy"
            />
            <div className="relative p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-ocean-deep/15 bg-white/50 px-3 py-1.5 text-sm text-ocean-deep">
                <span aria-hidden>🏖️</span> Beach
              </div>
              <h3 className="mt-5 font-display text-5xl leading-none tracking-wide text-ocean-deep md:text-6xl">
                Samedis matin
              </h3>
              <p className="mt-3 text-ocean-deep/70">Sable, soleil et convivialité. Saison beach de mai à août.</p>
              <div className="mt-6 rounded-xl border border-ocean-deep/12 bg-white/50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-ocean-deep/50">Horaire</div>
                <div className="mt-1 text-sm text-ocean-deep">
                  Samedi 10h00 → 13h00<br />
                  Pôle de l&apos;Ardilouse
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarifs */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-sand-light/60">Tarifs</div>
              <div className="mt-2 font-display text-5xl leading-none tracking-wide text-foam md:text-6xl">30€ / saison</div>
              <p className="mt-2 text-foam/60">Une formule simple, pensée pour venir jouer régulièrement.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:min-w-[360px]">
              {["Accès tous niveaux", "Tournois & rencontres", "Matériel inclus", "Ambiance conviviale"].map((t) => (
                <div key={t} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foam/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent text-xs text-foam">✓</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#join" className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-foam transition hover:bg-accent-light">
              Essai gratuit →
            </a>
            <a href="#contact" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-foam transition hover:bg-white/10">
              Nous contacter
            </a>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-accent px-6 py-4 text-center font-display text-2xl tracking-wide text-foam md:text-3xl">
          🏆 Tournois beach : 6 juin (Plage Nord, 10h–22h) · 12 juillet et 2 août (Ardilouse, 16h–22h)
        </div>
      </div>
    </section>
  );
}
