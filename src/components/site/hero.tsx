import { CrossMark, Wordmark } from "@/components/brand/logo";
import { EarlyAccessButton } from "./early-access-button";
import { HeroStage } from "./hero-stage";
import { Socials } from "./socials";
import { ThemeToggle } from "./theme-toggle";

/*
 * Opening sequence, once the intro screen lifts (timings in globals.css):
 *   1. The classic hero: cream (or black) with the wine glow, mark and wordmark.
 *   2. An iris opens from the cross and reveals the video underneath.
 *   3. Mark and wordmark dissolve, and their space closes so the CTA and socials settle centre.
 *   4. The video plays once and freezes on its final frame ("Welcome to CLVRY WRLD"), and the
 *      tagline arrives top-left.
 */
export function Hero() {
  return (
    <HeroStage
      // The scripture ticker above is ~2rem, so the hero plus ticker fill exactly one screen.
      className="hero relative isolate flex min-h-[calc(100svh-2rem)] flex-col items-center justify-center overflow-hidden bg-black px-6 py-20 text-center"
    >
      {/* Video. No poster attribute: it opens on black, and a still of the final frame would flash
          first. The poster sits underneath as the reduced-motion / failure still. */}
      <div aria-hidden className="hero-still absolute inset-0 -z-30">
        <video
          className="hero-video size-full object-cover"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
        >
          <source src="/videos/clvry-hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/videos/clvry-hero.webm" type="video/webm" />
          <source src="/videos/clvry-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* A soft pool of light (cream) or shade (dark) so the text stays legible over the video. */}
      <div aria-hidden className="hero-pool absolute inset-0 -z-20" />

      {/* The classic hero backdrop; the iris opens through it. */}
      <div aria-hidden className="hero-cover absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--wine)_0%,transparent_60%)] opacity-(--glow)" />
      </div>

      {/* Arrives as the video freezes (~3.6s), so it only ever sits on the footage: always cream. */}
      <p className="hero-in absolute top-5 left-5 font-display text-sm uppercase tracking-[0.5em] text-paper [text-shadow:0_1px_12px_rgb(0_0_0/0.45)] [--d:3.6s] md:top-8 md:left-10 md:text-base">
        Christ Above All
      </p>

      {/* Difference blend keeps the icon visible on cream, black and video alike. */}
      <ThemeToggle className="hero-in absolute top-4 right-5 text-white mix-blend-difference hover:text-white [--d:0.1s] md:right-8" />

      <div className="hero-ink flex flex-col items-center">
        <div className="hero-brand">
          <div className="hero-brand-inner flex flex-col items-center">
            <div className="w-[min(64vw,320px)]">
              <CrossMark className="w-full opacity-30" label="CLVRY — winged crucifix on the hill" />
            </div>
            <h1 className="mt-8 mb-5 w-[min(76vw,440px)] md:mt-10">
              <Wordmark className="w-full opacity-30" label="CLVRY" />
            </h1>
          </div>
        </div>

        <div className="hero-in mt-5 [--d:0.3s]">
          <EarlyAccessButton className="h-12 px-9" />
        </div>
        <Socials className="hero-in mt-6 [--d:0.4s]" />
      </div>
    </HeroStage>
  );
}
