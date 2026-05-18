"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Contact() {
  return (
    <section id="contact" className="bg-sand-light py-20 text-ocean-deep">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <ScrollReveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-wave">Contact</div>
          <h2 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">Nous trouver</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ocean-deep/70">
            Lacanau, Gironde — entre océan Atlantique et forêt de pins. Venez nous rencontrer sur un entraînement.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-ocean-deep/10 bg-white p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-ocean-deep/50">📍 Adresse salle</div>
            <div className="mt-3 text-sm leading-relaxed text-ocean-deep/80">
              19 Av. Albert François<br />
              33680 Lacanau (Salle COSEC)
            </div>
          </div>

          <div className="rounded-xl border border-ocean-deep/10 bg-white p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-ocean-deep/50">📅 Horaires</div>
            <div className="mt-3 text-sm leading-relaxed text-ocean-deep/80">
              Mardi 20h–23h (Indoor)<br />
              Jeudi 20h30–23h (Indoor)<br />
              Samedi 10h–13h (Beach · Ardilouse)
            </div>
          </div>

          <div className="rounded-xl border border-ocean-deep/10 bg-white p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-ocean-deep/50">📬 Contact</div>
            <div className="mt-3 space-y-2 text-sm text-ocean-deep/80">
              <div>
                <a href="tel:0634432002" className="font-medium underline underline-offset-4 decoration-accent/40 hover:text-ocean">
                  06 34 43 20 02
                </a>
              </div>
              <div>
                <a href="mailto:contact@lacanauvolley.fr" className="font-medium underline underline-offset-4 decoration-accent/40 hover:text-ocean">
                  contact@lacanauvolley.fr
                </a>
              </div>
              <div>
                <Link
                  href="https://www.facebook.com/volley.lacanau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4 decoration-accent/40 hover:text-ocean"
                >
                  Facebook · Lacanau Volley-Ball
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a href="tel:0634432002" className="rounded-xl bg-ocean-deep px-6 py-3 text-sm font-semibold text-foam transition hover:bg-ocean">
            Appeler →
          </a>
          <a href="mailto:contact@lacanauvolley.fr" className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-foam transition hover:bg-accent-light">
            Envoyer un mail →
          </a>
        </div>
      </div>
    </section>
  );
}
