import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/site";
import { publicPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, metaDescription: true, coverImageUrl: true },
  });
  if (!article) {
    return { title: "Article introuvable" };
  }
  const base = publicPageMetadata({
    title: article.title,
    description: article.metaDescription,
    path: `/actualites/${slug}`,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      images: article.coverImageUrl
        ? [{ url: article.coverImageUrl }]
        : base.openGraph?.images,
    },
  };
}

export default async function ActualiteArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await db.article.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!article) notFound();

  const url = `${siteUrl()}/actualites/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt?.toISOString(),
    url,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative h-56 w-full overflow-hidden bg-ocean md:h-72">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover opacity-90"
            priority
            sizes="100vw"
            unoptimized
          />
        ) : (
          <Image
            src="/imagesvideos/Images volley lacanau 1.jpg"
            alt=""
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ocean/95 via-ocean/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">
            <Link href="/actualites" className="hover:underline">
              Actualités
            </Link>
            {article.category ? <> · {article.category}</> : null}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">{article.title}</h1>
          {article.publishedAt ? (
            <p className="mt-2 text-sm text-white/75">
              {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 prose-headings:font-display prose-a:text-ocean">
          {article.content}
        </div>
        <p className="mt-10 text-sm text-slate-500">
          <Link href="/actualites" className="text-ocean hover:underline">
            ← Toutes les actualités
          </Link>
        </p>
      </article>
    </main>
  );
}
