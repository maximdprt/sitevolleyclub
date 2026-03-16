import Link from "next/link";

export const metadata = {
  title: "Partenaires — Lacanau Volley-Ball",
  description: "Ville de Lacanau, Comité de Gironde de Volley-Ball.",
};

const partners = [
  {
    category: "Institutionnels",
    items: [
      { name: "Ville de Lacanau", href: "https://www.lacanau.fr", description: "Soutien de la commune" },
      { name: "Comité de Gironde de Volley-Ball", href: "https://www.ffvb.org", description: "Fédération départementale" },
    ],
  },
  {
    category: "Équipements",
    items: [
      { name: "COSEC Lacanau", href: "#", description: "Salle multisports, 19 av. Albert François" },
    ],
  },
];

export default function PartenairesPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50/80 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Partenaires
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Merci à nos partenaires pour leur soutien.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        {partners.map((section) => (
          <section key={section.category} className="mb-16 last:mb-0">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              {section.category}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-ocean/40 hover:shadow-md"
                >
                  <span className="font-semibold text-slate-900">{item.name}</span>
                  <span className="mt-1 text-sm text-slate-600">{item.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
