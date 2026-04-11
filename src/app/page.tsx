import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Club } from "@/components/sections/Club";
import { Activities } from "@/components/sections/Activities";
import { Gallery } from "@/components/sections/Gallery";
import { Championship } from "@/components/sections/Championship";
import { Join } from "@/components/sections/Join";
import { Partners } from "@/components/sections/Partners";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...publicPageMetadata({
    title: "Accueil",
    description:
      "Lacanau Volley-Ball : club indoor et beach à Lacanau (Gironde). Horaires, adhésion, actualités et espace adhérents.",
    path: "/",
  }),
  title: {
    absolute: "Accueil · Volley indoor & beach | Lacanau Volley-Ball",
  },
};

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <h1 className="sr-only">
        Lacanau Volley-Ball — club de volley indoor et beach à Lacanau, Gironde
      </h1>
      <main>
        <Hero />
        <Stats />
        <Club />
        <Activities />
        <Gallery />
        <Championship />
        <Join />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
