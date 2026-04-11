import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  const host = new URL(base).host;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/espace-membre", "/api/", "/comite-direction", "/forum"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host,
  };
}
