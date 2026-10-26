import { CrossMark, Wordmark } from "@/components/brand/logo";
import { EarlyAccessButton } from "./early-access-button";
import { HeroStage } from "./hero-stage";
import { Socials } from "./socials";
import { ThemeToggle } from "./theme-toggle";

export function Hero() {
  return (
    <HeroStage
      // The scripture ticker above is ~2rem, so the hero plus ticker fill exactly one screen.
      className="hero relative isolate flex min-h-[calc(100svh-2rem)] flex-col items-center justify-center overflow-hidden bg-black px-6 py-20 text-center"
    >
      {/* Video. It fades up from black and back down to black, so the loop seam is invisible.
          No poster attribute: a still of the finished shot would flash, then cut to black. The
          poster sits underneath as the reduced-motion / failure still. */}
      <div aria-hidden className="hero-still absolute inset-0 -z-20">
        <video
          className="hero-video size-full object-cover"
          muted
          loop
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

      {/* A soft pool of light (cream) or shade (dark) behind the mark; the edges stay clear video. */}
      <div aria-hidden className="hero-pool absolute inset-0 -z-10" />

      <ThemeToggle className="hero-in absolute top-4 right-5 text-paper/80 hover:text-paper [--d:0.2s] md:right-8" />

      <div className="hero-ink flex flex-col items-center">
        <div className="hero-in w-[min(64vw,320px)] [--d:0.3s]">
          <CrossMark className="w-full opacity-80" label="CLVRY — winged crucifix on the hill" />
        </div>

        <h1 className="hero-in mt-8 w-[min(76vw,440px)] [--d:0.5s] md:mt-10">
          <Wordmark className="w-full opacity-80" label="CLVRY" />
        </h1>

        <p className="hero-in mt-5 font-display text-xs uppercase tracking-[0.5em] [--d:0.8s] md:text-sm">
          Christ Above All
        </p>

        <div className="hero-in mt-10 [--d:1.1s]">
          <EarlyAccessButton className="h-12 px-9" />
        </div>
        <Socials className="hero-in mt-6 [--d:1.3s]" />
      </div>
    </HeroStage>
  );
}
