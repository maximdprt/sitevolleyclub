"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";

export function Gallery() {
  const images = useMemo(
    () => [
      { src: "/images/team-4.jpg", alt: "Grande équipe Lacanau Volley" },
      { src: "/images/team-3.jpg", alt: "Équipe en salle au filet" },
      { src: "/images/team-5.jpg", alt: "Match rouge vs bleu" },
      { src: "/images/team-2.jpg", alt: "Stand forum associations" },
      { src: "/images/team-1.jpg", alt: "Équipe Lacanau Volley" },
    ],
    [],
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => { setIndex(i); setOpen(true); };

  return (
    <section id="gallery" className="bg-ocean-deep py-20 text-foam">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <ScrollReveal>
            <div className="text-xs font-semibold uppercase tracking-widest text-foam/50">Galerie</div>
            <h2 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">Le club en images</h2>
          </ScrollReveal>
          <Link
            href="https://www.facebook.com/volley.lacanau"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-foam transition hover:bg-white/8"
          >
            Toutes les photos →
          </Link>
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => openAt(i)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-white/8 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              aria-label={`Ouvrir : ${img.alt}`}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ocean-deep/60 opacity-0 transition duration-200 group-hover:opacity-100">
                  <span className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-foam backdrop-blur">
                    Zoom
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        images={images}
        open={open}
        index={index}
        onClose={() => setOpen(false)}
        onPrev={() => setIndex((v) => (v - 1 + images.length) % images.length)}
        onNext={() => setIndex((v) => (v + 1) % images.length)}
      />
    </section>
  );
}
