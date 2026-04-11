import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Tarifs & adhésion",
  description:
    "Cotisation Lacanau Volley-Ball : tarifs salle et beach, adhésion à partir de 10 ans. Rejoindre le club à Lacanau.",
  path: "/tarifs",
});

export default function TarifsPage() {
  return (
    <main>
      <PageHero
        title="Tarifs & adhésion"
        description="Cotisation annuelle du club. Pratique à partir de 10 ans."
        imageSrc="/imagesvideos/Im volley 3.jpg"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 font-semibold text-slate-900">Formule</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Prix</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Période</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Formule indoor</td>
                <td className="px-6 py-4 font-semibold text-ocean">30 €</td>
                <td className="px-6 py-4 text-slate-600">Année</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Formule beach</td>
                <td className="px-6 py-4 font-semibold text-ocean">30 €</td>
                <td className="px-6 py-4 text-slate-600">Saison (mai à octobre)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-slate-600">
          Pour adhérer ou avoir plus d’infos, contactez-nous au{" "}
          <a href="tel:0695043114" className="font-medium text-ocean hover:underline">06 95 04 31 14</a>
          {" "}ou par email{" "}
          <a
            href="mailto:david.lacanau33@orange.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ocean hover:underline"
          >
            david.lacanau33@orange.fr
          </a>
          .
        </p>

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-ocean px-6 py-3 font-semibold text-white transition hover:bg-ocean-light"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </main>
  );
}
