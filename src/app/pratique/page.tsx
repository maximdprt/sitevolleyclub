import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Pratique",
  description:
    "Horaires d'entraînement volley à Lacanau : mardi et jeudi au COSEC, beach volley mai à octobre. Infos pratiques club.",
  path: "/pratique",
});

export default function PratiquePage() {
  return (
    <main>
      <PageHero
        title="Pratique"
        description="Entraînements, horaires et pratique en salle / beach."
        imageSrc="/imagesvideos/Images volley 2.jpg"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <section id="entrainements">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Entraînements
          </h2>
          <p className="mt-4 text-slate-600">
            Volley loisir en salle, <strong>mardi de 20h00 à 23h00</strong> et <strong>jeudi de 20h30 à 23h00</strong> au COSEC de Lacanau.
            Ouvert à tous les adhérents à partir de 10 ans.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-slate-700">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-ocean" />
              Mardis 20h00 – 23h00 · Jeudis 20h30 – 23h00
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ocean" />
              COSEC, 19 av. Albert François, 33680 Lacanau
            </span>
          </div>
        </section>

        <section id="competition" className="mt-16">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Compétition
          </h2>
          <p className="mt-4 text-slate-600">
            Le club compte <strong>12 licenciés Compet&apos;Lib</strong>. La pratique principale reste le loisir,
            en salle et en beach (de mai à octobre).
          </p>
        </section>

        <div className="mt-12">
          <Link
            href="/tarifs"
            className="inline-flex rounded-full bg-ocean px-6 py-3 font-semibold text-white transition hover:bg-ocean-light"
          >
            Voir les tarifs
          </Link>
        </div>
      </div>
    </main>
  );
}
