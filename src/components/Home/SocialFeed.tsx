import Link from "next/link";
import { Facebook } from "lucide-react";

export function SocialFeed() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Suivez-nous sur les réseaux
            </h2>
            <p className="mt-2 text-slate-600">
              Actualités, photos et infos sur notre page Facebook.
            </p>
          </div>
          <Link
            href="https://www.facebook.com/volley.lacanau"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#1877F2] px-6 py-3.5 font-semibold text-white transition hover:bg-[#166FE5]"
          >
            <Facebook className="h-6 w-6" />
            Facebook Lacanau Volley
          </Link>
        </div>
      </div>
    </section>
  );
}
