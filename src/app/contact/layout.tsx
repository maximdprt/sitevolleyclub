import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Contact",
  description:
    "Contactez Lacanau Volley-Ball : adresse, téléphone, réseaux et formulaire pour rejoindre le club à Lacanau (Gironde).",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
