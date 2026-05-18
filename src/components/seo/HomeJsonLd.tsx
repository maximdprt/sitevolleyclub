import { FACEBOOK_URL, INSTAGRAM_URL, siteUrl } from "@/lib/site";

export function HomeJsonLd() {
  const url = siteUrl();
  const json = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Lacanau Volley-Ball",
    sport: "Volleyball",
    url,
    sameAs: [FACEBOOK_URL, INSTAGRAM_URL],
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
