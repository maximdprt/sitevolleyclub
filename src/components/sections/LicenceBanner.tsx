import { Download, FileText } from "lucide-react";

export const LICENCE_PDF_PATH = "/documents/Formulaire_demande_licences_2026_2027.pdf";

export function LicenceBanner() {
  return (
    <div className="rounded-2xl border border-accent/50 bg-ocean-deep/70 p-5 backdrop-blur md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-foam">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <div className="font-display text-2xl leading-none tracking-wide text-foam md:text-3xl">
              Formulaire de licence 2026-2027
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foam/75">
              Téléchargez le formulaire de demande de licence pour la saison 2026-2027,
              remplissez-le et renvoyez-le à{" "}
              <a
                href="mailto:contact@lacanauvolley.fr"
                className="font-semibold text-accent underline underline-offset-4 hover:text-accent-light"
              >
                contact@lacanauvolley.fr
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <a
            href={LICENCE_PDF_PATH}
            download
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-foam transition hover:bg-accent-light"
          >
            <Download className="h-4 w-4" aria-hidden />
            Télécharger le PDF
          </a>
          <a
            href={LICENCE_PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-5 py-3 text-sm font-semibold text-foam transition hover:bg-white/15"
          >
            Consulter en ligne
          </a>
        </div>
      </div>
    </div>
  );
}
