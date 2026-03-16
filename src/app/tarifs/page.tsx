import Link from "next/link";

export const metadata = {
  title: "Tarifs & adhésion — Lacanau Volley-Ball",
  description: "Cotisation annuelle : 30 € en salle, 30 € saison beach (mai à octobre).",
};

export default function TarifsPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50/80 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Tarifs & adhésion
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Cotisation annuelle du club. Pratique à partir de 10 ans.
          </p>
        </div>
      </section>

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
                <td className="px-6 py-4">Volley en salle</td>
                <td className="px-6 py-4 font-semibold text-ocean">30 €</td>
                <td className="px-6 py-4 text-slate-600">Année</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Beach volley</td>
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
          <a href="mailto:david.lacanau33@orange.fr" className="font-medium text-ocean hover:underline">david.lacanau33@orange.fr</a>.
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
