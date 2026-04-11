"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Dumbbell,
  PartyPopper,
  Newspaper,
  Users,
  Images,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Matchs", href: "/admin/matchs", icon: Calendar },
  { label: "Entraînements", href: "/admin/entrainements", icon: Dumbbell },
  { label: "Événements", href: "/admin/evenements", icon: PartyPopper },
  { label: "Articles", href: "/admin/articles", icon: Newspaper },
  { label: "Membres", href: "/admin/membres", icon: Users },
  { label: "Galerie", href: "/admin/galerie", icon: Images },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#f0f7ff]/8 bg-[#091b2f]">
      <div className="flex items-center gap-3 border-b border-[#f0f7ff]/8 px-5 py-5">
        <Image src="/images/LVB1.png" alt="" width={44} height={44} className="shrink-0" />
        <div className="min-w-0">
          <p className="truncate font-display text-sm tracking-wider text-[#f0f7ff]">Administration</p>
          <p className="text-[11px] text-[#f0f7ff]/40">Lacanau Volley-Ball</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#e8610a]/10 text-[#e8610a]"
                  : "text-[#f0f7ff]/50 hover:bg-[#f0f7ff]/5 hover:text-[#f0f7ff]/80"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
