import Link from "next/link";
import { Shirt, Users } from "lucide-react";

const cards = [
  {
    title: "Rejoindre le club",
    description: "30 € / an en salle, 30 € saison beach (mai à octobre). À partir de 10 ans.",
    href: "/tarifs",
    icon: Users,
    cta: "Tarifs & adhésion",
  },
  {
    title: "Boutique",
    description: "Maillots et goodies Lacanau Volley.",
    href: "/boutique",
    icon: Shirt,
    cta: "Boutique",
  },
];

export function CTACards() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          En pratique
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ title, description, href, icon: Icon, cta }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:border-ocean/40 hover:bg-white hover:shadow-lg sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-slate-600">
                {description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ocean group-hover:underline">
                {cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
