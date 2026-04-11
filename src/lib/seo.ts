import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const SITE_KEYWORDS = [
  "volley-ball",
  "Lacanau",
  "Gironde",
  "beach volley",
  "Lacanau Volley-Ball",
  "COSEC",
  "association sportive",
  "volley indoor",
] as const;

const OG_IMAGE = "/images/LVB1.png";

export function publicPageMetadata(opts: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const base = siteUrl();
  const url = opts.path ? `${base}${opts.path}` : base;
  const ogTitle = `${opts.title} | Lacanau Volley-Ball`;

  return {
    title: opts.title,
    description: opts.description,
    keywords: [...SITE_KEYWORDS],
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: opts.description,
      url,
      siteName: "Lacanau Volley-Ball",
      locale: "fr_FR",
      type: "website",
      images: [{ url: OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: opts.description,
      images: [OG_IMAGE],
    },
  };
}
