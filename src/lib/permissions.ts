/** Centralisation des règles d’accès (répliquées côté middleware Edge sans import Prisma). */

export const ROUTE_PREFIXES = {
  admin: "/admin",
  comite: "/comite-direction",
  member: "/espace-membre",
  legacyMember: "/espace-adherent",
  forum: "/forum",
} as const;

export function getRoleHome(role?: string): string {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "COMITE_DIRECTION") return "/comite-direction";
  return "/espace-membre";
}

export function canAccessAdmin(role?: string): boolean {
  return role === "ADMIN";
}

export function canAccessComite(role?: string): boolean {
  return role === "COMITE_DIRECTION" || role === "ADMIN";
}

export function canAccessMemberArea(role?: string): boolean {
  return role === "ADHERENT" || role === "COMITE_DIRECTION" || role === "ADMIN";
}

/** Préfixes pour lesquels la barre de navigation publique est masquée */
export function isDashboardLikePath(pathname: string): boolean {
  const p = pathname;
  if (p.startsWith(ROUTE_PREFIXES.admin)) return true;
  if (p.startsWith(ROUTE_PREFIXES.comite)) return true;
  if (p.startsWith(ROUTE_PREFIXES.member)) return true;
  if (p.startsWith(ROUTE_PREFIXES.legacyMember)) return true;
  if (p.startsWith(ROUTE_PREFIXES.forum)) return true;
  if (p === "/login" || p === "/register" || p === "/forgot-password") return true;
  return false;
}
