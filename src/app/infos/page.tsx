import Link from "next/link";
import { Calendar, FileText, Trophy, Users } from "lucide-react";

const links = [
  { label: "Calendrier", href: "/calendrier", icon: Calendar },
  { label: "Résultats", href: "/resultats", icon: Trophy },
  { label: "Partenaires", href: "/partenaires", icon: Users },
  { label: "Le club", href: "/le-club", icon: FileText },
];

export const metadata = {
  title: "Infos — Lacanau Volley-Ball",
  description: "Actualités, calendrier et infos du club.",
};

export default function InfosPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-50/80 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Infos
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Calendrier, résultats et actualités du club.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-ocean/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean text-white">
                <Icon className="h-6 w-6" />
              </div>
              <span className="font-semibold text-slate-900">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
