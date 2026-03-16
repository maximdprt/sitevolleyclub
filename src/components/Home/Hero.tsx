import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/imagesvideos/LVB Best.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-linear-to-b from-ocean/60 via-ocean/70 to-ocean/85" />
      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center lg:px-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          Club de volley loisir • Lacanau
        </p>
        <h1 className="font-display mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Bienvenue au club de Volley loisir de Lacanau
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/90">
          Entraînements tous les jeudis de 20h30 à 23h00 au COSEC. Rejoignez-nous pour une saison en salle ou sur le sable.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-hero-pill px-6 py-3.5 font-semibold text-hero-pill-text shadow-lg transition hover:bg-hero-pill-hover hover:shadow-xl"
          >
            Nous rejoindre
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pratique#entrainements"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/85 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            <Calendar className="h-4 w-4" />
            Horaires & lieu
          </Link>
        </div>
      </div>
    </section>
  );
}
