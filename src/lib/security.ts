import { headers } from "next/headers";

function toOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * Basic CSRF protection for JSON/form mutations.
 * Accepts only same-origin requests.
 */
export async function validateCsrfRequest(req: Request): Promise<boolean> {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return true;

  const hdrs = await headers();
  const origin = req.headers.get("origin") ?? hdrs.get("origin");
  if (!origin) return false;

  const requestOrigin = toOrigin(origin);
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  if (!requestOrigin || !host) return false;
  const expectedOrigin = `${proto}://${host}`;
  return requestOrigin === expectedOrigin;
}
