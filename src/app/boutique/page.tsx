import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Boutique",
  description: "Boutique du club Lacanau Volley-Ball : maillots et goodies (disponibilité à venir).",
  path: "/boutique",
});

export default function BoutiquePage() {
  return (
    <main>
      <PageHero
        title="Boutique"
        description="Maillots et équipement Lacanau Volley (à venir)."
        imageSrc="/imagesvideos/Images volley 2.jpg"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <p className="text-slate-600">
          La boutique en ligne sera bientôt disponible. En attendant, pour toute commande de maillots ou goodies,{" "}
          <Link href="/contact" className="text-ocean hover:underline">contactez le club</Link>.
        </p>
      </div>
    </main>
  );
}
