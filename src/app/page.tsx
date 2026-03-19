import { Navbar } from "@/components/ui/Navbar";
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

export default function Home() {
  return (
    <>
      <Navbar />
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
