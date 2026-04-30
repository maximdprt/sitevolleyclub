import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getRoleHome } from "@/lib/permissions";
import { updateSession } from "@/utils/supabase/middleware";

const MEMBER_PREFIXES = ["/espace-membre", "/espace-adherent", "/forum"];
const COMITE_PREFIXES = ["/comite-direction"];
const ADMIN_PREFIXES = ["/admin"];
const authSecret =
  process.env.AUTH_SECRET ??
  (process.env.NODE_ENV === "development"
    ? "dev-only-auth-secret-change-me-min-32-characters!!"
    : undefined);

function loginRedirect(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("auth", "1");
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export async function proxy(req: NextRequest) {
  const supabaseResponse = await updateSession(req);
  const { pathname } = req.nextUrl;

  // Force legacy login URL to land on home page.
  if (pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 307);
  }

  const token = await getToken({
    req,
    secret: authSecret,
  });

  // Legacy adhérent → espace membre
  if (pathname === "/espace-adherent" || pathname.startsWith("/espace-adherent/")) {
    const url = req.nextUrl.clone();
    const tail = pathname.slice("/espace-adherent".length);
    url.pathname = "/espace-membre" + tail;
    return NextResponse.redirect(url, 308);
  }

  if (ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!token || token.role !== "ADMIN") {
      return loginRedirect(req, pathname);
    }
  }

  if (COMITE_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!token || !["COMITE_DIRECTION", "ADMIN"].includes(token.role as string)) {
      return loginRedirect(req, pathname);
    }
  }

  if (MEMBER_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return loginRedirect(req, pathname);
    }
    if (token.status !== "ACTIVE") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "1");
      url.searchParams.set("error", "PENDING");
      return NextResponse.redirect(url);
    }
  }

  // Authenticated users visiting /register land on their dashboard.
  if (pathname === "/register" && token) {
    return NextResponse.redirect(new URL(getRoleHome(token.role as string), req.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|imagesvideos|fonts).*)",
  ],
};
