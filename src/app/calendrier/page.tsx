export const metadata = {
  title: "Calendrier — Lacanau Volley-Ball",
  description: "Entraînements et événements du club.",
};

export default function CalendrierPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50/80 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Calendrier
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Entraînements réguliers et dates à retenir.
          </p>
        </div>
      </section>

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
                <td className="px-6 py-4">Tous les jeudis, 20h30 – 23h00</td>
                <td className="px-6 py-4">COSEC Lacanau</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-6 py-4">Beach volley</td>
                <td className="px-6 py-4">Mai à octobre (selon météo)</td>
                <td className="px-6 py-4">Lacanau</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
