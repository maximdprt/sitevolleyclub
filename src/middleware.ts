import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADHERENT_PREFIXES = ["/espace-adherent", "/forum"];
const COMITE_PREFIXES = ["/comite-direction"];
const ADMIN_PREFIXES = ["/admin"];

function getRoleHome(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "COMITE_DIRECTION") return "/comite-direction";
  return "/espace-adherent";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // ─── Routes admin ───────────────────────────────────────────────────────────
  if (ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, req.url));
    }
  }

  // ─── Routes comité ─────────────────────────────────────────────────────────
  if (COMITE_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!token || !["COMITE_DIRECTION", "ADMIN"].includes(token.role as string)) {
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, req.url));
    }
  }

  // ─── Routes adhérent ───────────────────────────────────────────────────────
  if (ADHERENT_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, req.url));
    }
    if (token.status !== "ACTIVE") {
      return NextResponse.redirect(new URL("/login?error=PENDING", req.url));
    }
  }

  // ─── Redirection si déjà connecté ──────────────────────────────────────────
  if (["/login", "/register"].includes(pathname) && token) {
    return NextResponse.redirect(new URL(getRoleHome(token.role as string), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|imagesvideos|fonts).*)",
  ],
};
