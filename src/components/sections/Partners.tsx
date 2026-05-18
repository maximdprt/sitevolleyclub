"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const partners = [
  {
    name: "Ville de Lacanau",
    logo: "/images/Logo mairie de lacanau (1).jpg",
    href: "https://www.lacanau.fr",
  },
  {
    name: "Comité de Gironde de Volley-Ball",
    logo: "/images/logo-ffvolley.png",
    href: "https://www.ffvb.org",
  },
  {
    name: "Cap33",
    logo: "/images/Cap33-Evenement-Site.jpg",
  },
  {
    name: "BioEcoPrint",
    logo: "/images/logo-bioecoprint.png",
  },
  {
    name: "Atelier Marquage Aquitain",
    logo: "/images/logo-ama.png",
    href: "https://www.marquage-aquitaine.fr",
  },
] as const;

function PartnerCard({
  name,
  logo,
  href,
}: {
  name: string;
  logo: string;
  href?: string;
}) {
  const inner = (
    <div className="flex min-h-[120px] items-center justify-center rounded-xl bg-white p-5">
      <Image
        src={logo}
        alt={name}
        width={240}
        height={120}
        className="max-h-[88px] w-full object-contain"
        loading="lazy"
      />
    </div>
  );

  const className =
    "block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} title={name}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}

export function Partners() {
  return (
    <section id="partners" className="bg-ocean-deep py-20 text-foam">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <ScrollReveal>
          <div className="text-xs font-semibold uppercase tracking-widest text-foam/50">Partenaires</div>
          <h2 className="mt-3 font-display text-6xl leading-[0.9] tracking-wide md:text-7xl">Ils nous soutiennent</h2>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((p) => (
            <PartnerCard key={p.name} name={p.name} logo={p.logo} href={"href" in p ? p.href : undefined} />
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="max-w-lg text-sm leading-relaxed text-foam/70">
              Votre logo sur nos maillots, visibilité lors des matchs et sur nos réseaux (1 000+ abonnés).
              Contactez-nous pour une collaboration sur-mesure.
            </p>
            <Link
              href="#contact"
              className="shrink-0 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-foam transition hover:bg-accent-light"
            >
              Devenir partenaire →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
