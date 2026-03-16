export const metadata = {
  title: "Résultats — Lacanau Volley-Ball",
  description: "Résultats et classements du club.",
};

export default function ResultatsPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50/80 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Résultats
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Le club pratique principalement en loisir. Les résultats Compet&apos;Lib sont disponibles auprès du Comité de Gironde.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <p className="text-slate-600">
          Pour les classements et résultats des équipes licenciées Compet&apos;Lib, consultez le site du{" "}
          <a href="https://www.ffvb.org" target="_blank" rel="noopener noreferrer" className="text-ocean hover:underline">
            Comité de Gironde de Volley-Ball
          </a>.
        </p>
      </div>
    </main>
  );
}
