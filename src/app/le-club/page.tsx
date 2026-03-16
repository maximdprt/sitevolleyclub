import Image from "next/image";

export const metadata = {
  title: "Le club — Lacanau Volley-Ball",
  description: "Présentation du club ASL Volley / Lacanau Volley-Ball, historique et bureau.",
};

export default function LeClubPage() {
  return (
    <main>
      <section className="relative h-64 w-full overflow-hidden bg-ocean md:h-80">
        <Image
          src="/imagesvideos/Images volley lacanau 1.jpg"
          alt="Volley à Lacanau"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-end bg-linear-to-t from-ocean/90 to-transparent p-6 md:p-10">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Le club
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <section className="max-w-none">
          <h2 id="presentation">Présentation</h2>
          <p>
            <strong>ASL Volley / Lacanau Volley-Ball</strong> est un club de volley loisir basé à Lacanau, en Gironde.
            Bienvenue au club de Volley loisir de Lacanau : nous proposons une pratique en salle et en beach (de mai à octobre),
            ouverte à tous à partir de 10 ans. Le club compte environ <strong>40 adhérents</strong> et <strong>12 licenciés Compet&apos;Lib</strong>.
          </p>
        </section>

        <section className="mt-16 flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1">
            <h2 id="historique" className="font-display text-2xl font-bold text-slate-900">
              Historique
            </h2>
            <p className="mt-4 text-slate-600">
              Le club a été créé en <strong>2010</strong>. Depuis, il anime la vie volley-ball à Lacanau Ville,
              au COSEC (salle multisports Albert François), et sur le sable en saison beach.
            </p>
          </div>
          <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-200 lg:h-72 lg:w-96">
            <Image
              src="/imagesvideos/Im volley 3.jpg"
              alt="Volley à Lacanau"
              fill
              className="object-cover"
            />
          </div>
        </section>

        <section className="mt-16 flex flex-col gap-10 lg:flex-row-reverse lg:items-center lg:gap-16">
          <div className="flex-1">
            <h2 id="bureau" className="font-display text-2xl font-bold text-slate-900">
              Bureau
            </h2>
            <p className="mt-4 text-slate-600">
              <strong>David Da Costa</strong> — Président et contact principal du club.
            </p>
            <p className="mt-2 text-slate-600">
              Contact : <a href="tel:0695043114" className="text-ocean hover:underline">06 95 04 31 14</a>
              {" · "}
              <a href="mailto:david.lacanau33@orange.fr" className="text-ocean hover:underline">david.lacanau33@orange.fr</a>
            </p>
          </div>
          <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-200 lg:h-72 lg:w-96">
            <Image
              src="/imagesvideos/img volley 5.jpg"
              alt="Équipe"
              fill
              className="object-cover"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
