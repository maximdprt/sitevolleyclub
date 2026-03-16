import Link from "next/link";

export const metadata = {
  title: "Billetterie — Lacanau Volley-Ball",
  description: "Événements et matchs du club.",
};

export default function BilletteriePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50/80 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Billetterie
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Pour les événements et matchs amicaux, contactez le club.
          </p>
        </div>
      </section>

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
