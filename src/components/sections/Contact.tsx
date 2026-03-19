"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Contact() {
  return (
    <section id="contact" className="bg-sand-light py-20 text-ocean-deep">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-7xl leading-[0.9] tracking-wide md:text-8xl">Nous trouver</h2>
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
            Lacanau, Gironde — entre océan Atlantique et forêt de pins. Venez nous rencontrer sur un entraînement.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-ocean-deep/10 bg-white p-8 shadow-sm">
            <div className="font-ui text-xs uppercase tracking-[0.2em] text-ocean-deep/70">📍 Adresse salle</div>
            <div className="mt-4 text-ocean-deep/85">
              19 Av. Albert François<br />
              33680 Lacanau (Salle Cosec)
            </div>
          </div>
          <div className="rounded-3xl border border-ocean-deep/10 bg-white p-8 shadow-sm">
            <div className="font-ui text-xs uppercase tracking-[0.2em] text-ocean-deep/70">📅 Entraînements</div>
            <div className="mt-4 text-ocean-deep/85">
              Jeudi 20h30–23h00 (Indoor)<br />
              Samedi 10h–12h30 (Beach)
            </div>
          </div>
          <div className="rounded-3xl border border-ocean-deep/10 bg-white p-8 shadow-sm">
            <div className="font-ui text-xs uppercase tracking-[0.2em] text-ocean-deep/70">📘 Facebook</div>
            <div className="mt-4 text-ocean-deep/85">
              <Link
                href="https://www.facebook.com/volley.lacanau"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ocean underline decoration-accent/50 underline-offset-4"
              >
                Lacanau Volley-Ball
              </Link>{" "}
              <span className="text-ocean-deep/70">(+1000 abonnés)</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="tel:0695043114"
                data-cursor="hover"
                className="rounded-full bg-ocean-deep px-5 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam"
              >
                Appeler
              </a>
              <a
                href="mailto:david.lacanau33@orange.fr"
                data-cursor="hover"
                className="rounded-full bg-accent px-5 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

