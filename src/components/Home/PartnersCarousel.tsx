"use client";

const partners = [
  { name: "Ville de Lacanau", slug: "lacanau" },
  { name: "Comité de Gironde de Volley-Ball", slug: "gironde" },
  { name: "COSEC Lacanau", slug: "cosec" },
];

export function PartnersCarousel() {
  return (
    <section className="border-b border-slate-200 bg-slate-50/80 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="font-display text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Nos partenaires
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-12 lg:gap-16">
          {partners.map((p) => (
            <div
              key={p.slug}
              className="flex h-16 min-w-[140px] items-center justify-center rounded-xl bg-white px-6 py-4 text-center text-sm font-semibold text-slate-600 shadow-sm transition hover:shadow-md"
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
