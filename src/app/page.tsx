import { ComingSoon } from "@/components/site/coming-soon";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Newsletter } from "@/components/site/newsletter";
import { NewsletterPopup } from "@/components/site/newsletter-popup";
import { ScriptureTicker } from "@/components/site/scripture-ticker";

/*
 * Parked until launch: Shop, Story and Circle Sessions are built (components/site/*.tsx,
 * data in lib/catalog.ts) but hidden behind the Coming Soon block. To bring them back:
 *
 *   import { HydrationBoundary } from "@tanstack/react-query";
 *   import { Suspense } from "react";
 *   import { CircleSessions } from "@/components/site/circle-sessions";
 *   import { Shop } from "@/components/site/shop";
 *   import { Story } from "@/components/site/story";
 *   import { getLandingState } from "@/lib/prefetch";
 *
 *   make Home async, wrap the page in <HydrationBoundary state={await getLandingState()}>, and
 *   render in place of <ComingSoon />:
 *
 *   <Suspense fallback={<div className="min-h-160" />}><Shop /></Suspense>
 *   <Story />
 *   <Suspense fallback={<div className="min-h-160" />}><CircleSessions /></Suspense>
 *
 * (useQuery reads the clock during render, so query-driven sections must sit inside Suspense.)
 */

export default function Home() {
  return (
    <>
      <ScriptureTicker />
      {/* <Header /> */}
      <main>
        <Hero />
        {/* <Marquee /> */}
        {/* <ComingSoon /> */}
        {/* <Newsletter /> */}
      </main>
      {/* <Footer /> */}
      <NewsletterPopup />
    </>
  );
}
