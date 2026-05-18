import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { publicPageMetadata } from "@/lib/seo";
import { homePartners } from "@/lib/partners";

export const metadata: Metadata = publicPageMetadata({
  title: "Partenaires",
  description:
    "Partenaires de Lacanau Volley-Ball : Ville de Lacanau, Comité de Gironde de volley et soutiens locaux.",
  path: "/partenaires",
});

const otherPartners = [
  {
    name: "COSEC Lacanau",
    href: "https://www.lacanau.fr",
    description: "Salle multisports, 19 av. Albert François",
  },
];

export default function PartenairesPage() {
  return (
    <main>
      <PageHero
        title="Partenaires"
        description="Merci à nos partenaires pour leur soutien."
        imageSrc="/imagesvideos/Logo mairie de lacanau.jpg"
      />

      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8 lg:py-16">
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-slate-900">Nos partenaires</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {homePartners.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                title={p.name}
                className="flex min-h-[120px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-ocean/40 hover:shadow-md"
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={200}
                  height={100}
                  className="max-h-[80px] w-full object-contain"
                />
              </Link>
            ))}
          </div>
        </section>

        {otherPartners.length > 0 ? (
          <section>
            <h2 className="font-display text-2xl font-bold text-slate-900">Autres soutiens</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {otherPartners.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-ocean/40 hover:shadow-md"
                >
                  <span className="font-semibold text-slate-900">{item.name}</span>
                  <span className="mt-1 text-sm text-slate-600">{item.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
