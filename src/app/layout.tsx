import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const bodySans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Accueil · Volley indoor & beach",
    template: "%s | Lacanau Volley-Ball",
  },
  description:
    "Club de volley-ball de Lacanau, Gironde. Entraînements le mardi et jeudi soir et beach le dimanche. Rejoignez-nous ! 40 adhérents, fondé en 2010.",
  keywords: ["volley-ball", "Lacanau", "Gironde", "beach volley", "sport", "association"],
  openGraph: {
    title: "AS Lacanau Volley Ball",
    description: "Entre océan et forêt · Indoor & Beach · Depuis 2010",
    images: ["/images/LVC_FINAL%20LOGO-04.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AS Lacanau Volley Ball",
    description: "Entre océan et forêt · Indoor & Beach · Depuis 2010",
    images: ["/images/LVC_FINAL%20LOGO-04.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${bebas.variable} ${dmSans.variable} ${bodySans.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
