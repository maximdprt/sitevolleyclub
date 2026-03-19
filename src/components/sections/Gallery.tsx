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
      { src: "/images/team-3.jpg", alt: "Équipe en salle (maillots bleus) au filet" },
      { src: "/images/team-5.jpg", alt: "Match (rouge vs bleu)" },
      { src: "/images/team-2.jpg", alt: "Stand forum associations" },
      { src: "/images/team-1.jpg", alt: "Équipe Lacanau Volley" },
    ],
    [],
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <section id="gallery" className="bg-ocean-deep py-20 text-foam">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <ScrollReveal className="max-w-2xl">
            <h2 className="font-display text-7xl leading-[0.9] tracking-wide md:text-8xl">Le Club en images</h2>
            <p className="mt-5 font-body text-lg leading-relaxed text-foam/80">
              Un aperçu de l’ambiance indoor et beach, entre océan, pins et esprit d’équipe.
            </p>
          </ScrollReveal>
          <Link
            href="https://www.facebook.com/volley.lacanau"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="rounded-full bg-wave px-6 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam transition hover:bg-foam hover:text-ocean-deep"
          >
            Voir toutes nos photos sur Facebook →
          </Link>
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              data-cursor="hover"
              onClick={() => openAt(i)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              aria-label={`Ouvrir la photo: ${img.alt}`}
            >
              <div className="relative w-full overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-ocean-deep/60 opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-white/10 px-5 py-3 font-ui text-xs uppercase tracking-[0.18em] text-foam backdrop-blur">
                    Zoom
                  </div>
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

