import { siteUrl } from "@/lib/site";

export function HomeJsonLd() {
  const url = siteUrl();
  const json = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Lacanau Volley-Ball",
    sport: "Volleyball",
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lacanau",
      addressRegion: "Gironde",
      addressCountry: "FR",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
