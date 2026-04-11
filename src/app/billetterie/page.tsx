import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Billetterie",
  description:
    "Billetterie et événements Lacanau Volley-Ball : matchs amicaux et soirées — contactez le club pour les places.",
  path: "/billetterie",
});

export default function BilletteriePage() {
  return (
    <main>
      <PageHero
        title="Billetterie"
        description="Pour les événements et matchs amicaux, contactez le club."
        imageSrc="/imagesvideos/Images volley lacanau 1.jpg"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <p className="text-slate-600">
          Le club organise des entraînements ouverts et des rencontres amicales. Pour toute information sur les prochains événements, rendez-vous sur notre{" "}
          <a href="https://www.facebook.com/volley.lacanau" target="_blank" rel="noopener noreferrer" className="text-ocean hover:underline">
            page Facebook
          </a>{" "}
          ou <Link href="/contact" className="text-ocean hover:underline">contactez-nous</Link>.
        </p>
      </div>
    </main>
  );
}
