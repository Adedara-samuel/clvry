import { HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { CircleSessions } from "@/components/site/circle-sessions";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Newsletter } from "@/components/site/newsletter";
import { Shop } from "@/components/site/shop";
import { Story } from "@/components/site/story";
import { getLandingState } from "@/lib/prefetch";

export default async function Home() {
  // Seed the client cache at build time so the landing page ships fully rendered.
  const state = await getLandingState();

  return (
    <HydrationBoundary state={state}>
      <div className="bg-fire py-2 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-paper">
        Circle Sessions Vol. 01 — streaming soon
      </div>
      <Header />
      <main>
        <Hero />
        <Marquee />
        {/* useQuery reads the clock during render, so query-driven sections stream inside Suspense. */}
        <Suspense fallback={<div className="min-h-[640px]" />}>
          <Shop />
        </Suspense>
        <Story />
        <Suspense fallback={<div className="min-h-[640px]" />}>
          <CircleSessions />
        </Suspense>
        <Newsletter />
      </main>
      <Footer />
    </HydrationBoundary>
  );
}
