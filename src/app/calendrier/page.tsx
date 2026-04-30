import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Calendrier",
  description:
    "Calendrier des entraînements et temps forts du club Lacanau Volley-Ball : reprise, tournois et événements.",
  path: "/calendrier",
});

export default function CalendrierPage() {
  return (
    <main>
      <PageHero
        title="Calendrier"
        description="Entraînements réguliers et dates à retenir."
        imageSrc="/imagesvideos/Images volley 2.jpg"
      />

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 font-semibold text-slate-900">Événement</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Jour / Horaire</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Lieu</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Entraînement loisir</td>
                <td className="px-6 py-4">Tous les mardis, 20h00 – 23h00</td>
                <td className="px-6 py-4">COSEC Lacanau</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Entraînement loisir</td>
                <td className="px-6 py-4">Tous les jeudis, 20h30 – 23h00</td>
                <td className="px-6 py-4">COSEC Lacanau</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Beach volley</td>
                <td className="px-6 py-4">Tous les samedis de mai et juin, 9h00 – 13h00</td>
                <td className="px-6 py-4">Pôle de l&apos;Ardilouse</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Beach volley</td>
                <td className="px-6 py-4">Tous les samedis de juillet et août, 10h00 – 13h00</td>
                <td className="px-6 py-4">Pôle de l&apos;Ardilouse</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Tournoi</td>
                <td className="px-6 py-4">6 juin, 10h00 – 22h00</td>
                <td className="px-6 py-4">Plage Nord</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Tournoi</td>
                <td className="px-6 py-4">12 juillet, 16h00 – 22h00</td>
                <td className="px-6 py-4">Pôle de l&apos;Ardilouse</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Tournoi</td>
                <td className="px-6 py-4">2 août, 16h00 – 22h00</td>
                <td className="px-6 py-4">Pôle de l&apos;Ardilouse</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-slate-600">
          Les calendriers et résultats sont consultables sur la Fédération Française de Volley-Ball via <strong>FFvolley - Gestion Sportive</strong>.
        </p>
      </div>
    </main>
  );
}
