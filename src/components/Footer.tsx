import Link from "next/link";
import { Mail, Phone, MapPin, Facebook } from "lucide-react";

const links = [
  { label: "Le club", href: "/le-club" },
  { label: "Pratique & tarifs", href: "/tarifs" },
  { label: "Calendrier", href: "/calendrier" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-xl font-bold text-white">
              Lacanau Volley
            </Link>
            <p className="mt-3 max-w-md text-sm">
              Club de volley loisir de Lacanau. Entraînements tous les jeudis au COSEC. Salle et beach (mai–octobre).
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <a href="tel:0695043114" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" />
                06 95 04 31 14
              </a>
              <a href="mailto:david.lacanau33@orange.fr" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4" />
                david.lacanau33@orange.fr
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                COSEC, 19 av. Albert François, 33680 Lacanau
              </span>
            </div>
            <a
              href="https://www.facebook.com/volley.lacanau"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[#1877F2] hover:underline"
            >
              <Facebook className="h-5 w-5" />
              Facebook
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-white">Liens</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Horaires</h3>
            <p className="mt-4 text-sm">
              Jeudis 20h30 – 23h00
              <br />
              COSEC Lacanau
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Lacanau Volley-Ball • ASL Volley
        </div>
      </div>
    </footer>
  );
}
