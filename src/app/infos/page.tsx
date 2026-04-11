import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, FileText, Trophy, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { publicPageMetadata } from "@/lib/seo";

const links = [
  { label: "Calendrier", href: "/calendrier", icon: Calendar },
  { label: "Résultats", href: "/resultats", icon: Trophy },
  { label: "Partenaires", href: "/partenaires", icon: Users },
  { label: "Le club", href: "/le-club", icon: FileText },
];

export const metadata: Metadata = publicPageMetadata({
  title: "Infos",
  description:
    "Liens utiles Lacanau Volley-Ball : calendrier, résultats, partenaires et présentation du club à Lacanau.",
  path: "/infos",
});

export default function InfosPage() {
  return (
    <main>
      <PageHero
        title="Infos"
        description="Calendrier, résultats et actualités du club."
        imageSrc="/imagesvideos/Images volley lacanau 1.jpg"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-ocean/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean text-white">
                <Icon className="h-6 w-6" />
              </div>
              <span className="font-semibold text-slate-900">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
