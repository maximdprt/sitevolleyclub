import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Résultats — Lacanau Volley-Ball",
  description: "Résultats et classements du club.",
};

export default function ResultatsPage() {
  return (
    <main>
      <PageHero
        title="Résultats"
        description="Le club pratique principalement en loisir. Les résultats Compet'Lib sont disponibles auprès du Comité de Gironde."
        imageSrc="/imagesvideos/img volley 5.jpg"
      />

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
