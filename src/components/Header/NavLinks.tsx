"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const mainNav = [
  { label: "Présentation", href: "/le-club" },
  { label: "Pratique", href: "/pratique", children: [{ label: "Entraînements", href: "/pratique#entrainements" }, { label: "Tarifs", href: "/tarifs" }, { label: "Compétition", href: "/pratique#competition" }] },
  { label: "Infos", href: "/infos", children: [{ label: "Calendrier", href: "/calendrier" }, { label: "Résultats", href: "/resultats" }, { label: "Partenaires", href: "/partenaires" }] },
  { label: "Contact", href: "/contact" },
];

export function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  return (
    <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-0">
      {mainNav.map((item) => (
        <li key={item.href} className="group relative">
          {item.children ? (
            <>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-1 px-4 py-3 text-left font-medium text-slate-700 transition hover:text-ocean lg:w-auto lg:py-6 lg:justify-start"
                onClick={() => setOpenKey(openKey === item.href ? null : item.href)}
              >
                {item.label}
                <ChevronDown className={`h-4 w-4 shrink-0 transition lg:group-hover:rotate-180 ${openKey === item.href ? "rotate-180" : ""} lg:block`} />
              </button>
              <ul
                className={`pl-4 lg:absolute lg:left-0 lg:top-full lg:z-50 lg:min-w-[200px] lg:rounded-xl lg:border lg:border-slate-200 lg:bg-white lg:py-2 lg:pl-0 lg:shadow-xl ${openKey === item.href ? "max-lg:block" : ""} hidden lg:group-hover:block`}
              >
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={onLinkClick}
                      className="block px-4 py-2 text-slate-600 transition hover:bg-sand hover:text-ocean lg:px-5"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link
              href={item.href}
              onClick={onLinkClick}
              className="block px-4 py-3 font-medium text-slate-700 transition hover:text-ocean lg:py-6"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
