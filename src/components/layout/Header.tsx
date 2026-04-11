"use client";

import { signOut } from "next-auth/react";
import { LogOut, Settings, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title?: string;
  userName?: string;
  isAdmin?: boolean;
}

export function Header({ title, userName, isAdmin }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#f0f7ff]/8 bg-[#0d2237] px-6">
      <div>
        {title && (
          <h1 className="font-display text-xl tracking-wide text-[#f0f7ff]">{title}</h1>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#f0f7ff]/70 transition-colors hover:bg-[#f0f7ff]/5 hover:text-[#f0f7ff] focus:outline-none">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a3a5c] text-xs font-semibold text-[#f0f7ff]/70">
              {userName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <span className="hidden sm:inline">{userName ?? "Mon compte"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/espace-membre">
                <LayoutDashboard className="h-4 w-4" />
                Espace membre
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/espace-membre/profil">
              <User className="h-4 w-4" />
              Profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={isAdmin ? "/admin/dashboard" : "/espace-membre"}>
              <Settings className="h-4 w-4" />
              Accueil tableau de bord
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-red-400 focus:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
