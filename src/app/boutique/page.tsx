import Link from "next/link";

export const metadata = {
  title: "Boutique — Lacanau Volley-Ball",
  description: "Maillots et goodies du club.",
};

export default function BoutiquePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50/80 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Boutique
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Maillots et équipement Lacanau Volley (à venir).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <p className="text-slate-600">
          La boutique en ligne sera bientôt disponible. En attendant, pour toute commande de maillots ou goodies,{" "}
          <Link href="/contact" className="text-ocean hover:underline">contactez le club</Link>.
        </p>
      </div>
    </main>
  );
}
