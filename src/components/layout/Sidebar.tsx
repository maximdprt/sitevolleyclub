"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Upload,
  User,
  Shield,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
}

const MEMBER_HOME = "/espace-membre";

const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: MEMBER_HOME, icon: LayoutDashboard },
  { label: "Mes documents", href: `${MEMBER_HOME}/documents`, icon: FileText },
  { label: "Déposer un document", href: `${MEMBER_HOME}/documents/upload`, icon: Upload },
  { label: "Mon profil", href: `${MEMBER_HOME}/profil`, icon: User },
  { label: "Comité de direction", href: "/comite-direction", icon: Shield, roles: ["COMITE_DIRECTION", "ADMIN"] },
  { label: "Forum", href: "/forum", icon: MessageSquare },
];

interface SidebarProps {
  userRole?: string;
  userName?: string;
}

export function Sidebar({ userRole = "ADHERENT", userName }: SidebarProps) {
  const pathname = usePathname();

  const filtered = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#f0f7ff]/8 bg-[#091b2f]">
      <div className="flex items-center gap-3 border-b border-[#f0f7ff]/8 px-5 py-5">
        <Image
          src="/images/LVB1.png"
          alt=""
          width={44}
          height={44}
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className="truncate font-display text-sm tracking-wider text-[#f0f7ff]">
            Lacanau Volley
          </p>
          <p className="text-[11px] text-[#f0f7ff]/40">Espace membre</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {filtered.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== MEMBER_HOME && pathname.startsWith(item.href));
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

      {userName && (
        <div className="border-t border-[#f0f7ff]/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a3a5c] text-xs font-semibold text-[#f0f7ff]/70">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-[#f0f7ff]/80">{userName}</p>
              <p className="text-[11px] capitalize text-[#f0f7ff]/30">
                {userRole.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
