import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { HeroStage } from "./hero-stage";
import { Socials } from "./socials";
import { ThemeToggle } from "./theme-toggle";

/*
 * The video plays straight away, once, and freezes on its final frame ("Welcome to CLVRY WRLD");
 * the tagline arrives top-left as it does. The Explore button and socials sit centre from the start.
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

      {/* Arrives as the video freezes (~3.6s), so it only ever sits on the footage: always cream. */}
      <p className="hero-in absolute top-1 left-5 font-display text-sm uppercase tracking-[0.2em] text-paper [text-shadow:0_1px_12px_rgb(0_0_0/0.45)] [--d:3.6s] md:top-5 md:left-10 md:text-base ">
        Christ Above All
      </p>

      {/* Difference blend keeps the icon visible on cream, black and video alike. */}
      <ThemeToggle className="hero-in absolute top-4 right-5 text-white mix-blend-difference hover:text-white [--d:0.1s] md:right-8" />

      <div className="hero-ink flex flex-col items-center">
        {/* The video says the name; the heading is for screen readers and search. */}
        <h1 className="sr-only">CLVRY — Christ Above All</h1>

        <div className="hero-in [--d:0.3s]">
          {/* Opens Explore on Ethos */}
          <Link
            href="/explore/ethos"
            className="btn-prism group inline-flex h-12 items-center justify-center gap-3 px-9 font-mono text-[11px] uppercase tracking-[0.25em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Explore
            <ArrowRightIcon strokeWidth={1.5} className="size-3.5 transition duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <Socials className="hero-in mt-6 [--d:0.4s]" />
      </div>
    </HeroStage>
  );
}
