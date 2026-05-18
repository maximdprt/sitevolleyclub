export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000"
  );
}

export const FACEBOOK_URL = "https://www.facebook.com/volley.lacanau";
export const INSTAGRAM_URL = "https://www.instagram.com/lacanau_volley_club/";
