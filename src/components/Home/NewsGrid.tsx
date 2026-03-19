import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const news = [
  {
    title: "Reprise des entraînements 2024-2025",
    href: "/infos",
    image: "/imagesvideos/Images volley lacanau 1.jpg",
  },
  {
    title: "Beach volley : saison mai à octobre",
    href: "/pratique",
    image: "/imagesvideos/Images volley 2.jpg",
  },
  {
    title: "40 adhérents et 12 licenciés Compet'Lib",
    href: "/le-club",
    image: "/imagesvideos/img volley 5.jpg",
  },
];

export function NewsGrid() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Actualités
            </h2>
            <p className="mt-2 text-slate-600">
              Les dernières infos du club.
            </p>
          </div>
          <Link
            href="/infos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ocean transition hover:text-ocean-light"
          >
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-ocean/30 hover:shadow-lg"
            >
              <div className="aspect-4/3 overflow-hidden bg-slate-200">
                <Image
                  src={item.image}
                  alt=""
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="mt-2 font-semibold text-slate-900 transition group-hover:text-ocean">
                  {item.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-ocean">
                  Lire la suite
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
