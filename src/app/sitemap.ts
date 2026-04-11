import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/le-club",
  "/pratique",
  "/calendrier",
  "/contact",
  "/infos",
  "/resultats",
  "/partenaires",
  "/tarifs",
  "/boutique",
  "/billetterie",
  "/actualites",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  let articles: { slug: string; updatedAt: Date }[] = [];
  try {
    articles = await db.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB unavailable (e.g. local build without DATABASE_URL) — static URLs only
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/actualites/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
