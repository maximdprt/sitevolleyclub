import {
  Hero,
  NewsGrid,
  NextMatch,
  CTACards,
  PartnersCarousel,
  SocialFeed,
} from "@/components/Home";

export default function Home() {
  return (
    <main>
      <Hero />
      <NewsGrid />
      <NextMatch />
      <CTACards />
      <SocialFeed />
      <PartnersCarousel />
    </main>
  );
}
