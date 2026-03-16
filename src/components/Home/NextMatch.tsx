import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";

export function NextMatch() {
  return (
    <section className="border-b border-slate-200 bg-linear-to-br from-sand/50 to-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Prochain rendez-vous
        </h2>
        <div className="mt-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex-row">
          <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-ocean">
                Entraînement loisir
              </p>
              <p className="mt-2 text-slate-600">
                Session ouverte à tous les adhérents. Volley en salle au COSEC.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-slate-700">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ocean" />
                Tous les jeudis, 20h30 – 23h00
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-ocean" />
                COSEC, 19 av. Albert François, 33680 Lacanau
              </span>
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ocean px-6 py-3 font-semibold text-white transition hover:bg-ocean-light"
            >
              <Ticket className="h-4 w-4" />
              Nous rejoindre / Infos
            </Link>
          </div>
          <div className="relative h-48 bg-slate-200 lg:min-h-[280px] lg:min-w-[320px] lg:flex-1">
            <Image
              src="/imagesvideos/Im volley 3.jpg"
              alt="Entraînement volley"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
