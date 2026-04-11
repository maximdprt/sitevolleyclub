import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { publicPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = publicPageMetadata({
  title: "Actualités",
  description:
    "Actualités du club Lacanau Volley-Ball : compétitions, vie de l'asso et infos pratiques à Lacanau (Gironde).",
  path: "/actualites",
});

export default async function ActualitesIndexPage() {
  const articles = await db.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      metaDescription: true,
      category: true,
      publishedAt: true,
    },
  });

  return (
    <main>
      <PageHero
        title="Actualités"
        description="Infos du club, compétitions et vie de l'association."
        imageSrc="/imagesvideos/Images volley lacanau 1.jpg"
      />

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
        <ul className="space-y-6">
          {articles.length === 0 ? (
            <li className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              Aucun article publié pour le moment.
            </li>
          ) : (
            articles.map((a) => (
              <li key={a.slug}>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-ocean/30">
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    <Link href={`/actualites/${a.slug}`} className="hover:text-ocean">
                      {a.title}
                    </Link>
                  </h2>
                  {a.category ? (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ocean">{a.category}</p>
                  ) : null}
                  <p className="mt-2 text-sm text-slate-600">{a.metaDescription}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {a.publishedAt
                      ? new Date(a.publishedAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : null}
                  </p>
                </article>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
