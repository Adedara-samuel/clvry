import { CrossMark, Wordmark } from "@/components/brand/logo";
import { EarlyAccessButton } from "./early-access-button";
import { HeroStage } from "./hero-stage";
import { Socials } from "./socials";
import { ThemeToggle } from "./theme-toggle";

const POSTER = "/images/clvry-hero-poster.jpg";
const TAGLINE = "Christ Above All";

export function Hero() {
  return (
    <HeroStage
      // The scripture ticker above is ~2rem, so the hero plus ticker fill exactly one screen.
      className="hero relative isolate flex min-h-[calc(100svh-2rem)] flex-col items-center justify-center overflow-hidden bg-(--hero-base) px-6 py-24 text-center"
    >
      {/* 1. Video (the poster doubles as the reduced-motion still) */}
      <div
        aria-hidden
        className="hero-media absolute inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: `url(${POSTER})` }}
      >
        <video
          className="hero-video size-full object-cover"
          poster={POSTER}
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

      {/* 2. Wash: cream (light) / near-black (dark) with the glow behind the mark */}
      <div aria-hidden className="hero-wash absolute inset-0 -z-20" />
      <div aria-hidden className="hero-veil absolute inset-0 -z-10" />

      <ThemeToggle className="hero-in absolute top-4 right-5 z-10 text-(--hero-ink)/70 [--d:0.2s] md:right-8" />

      {/* 3. Mark, wordmark, tagline */}
      <div className="hero-content flex flex-col items-center">
        <div className="relative w-[min(78vw,400px)]">
          <div aria-hidden className="hero-halo absolute -inset-[30%] -z-10 rounded-full" />
          <div className="hero-in [--d:0.4s]">
            <CrossMark className="w-full" label="CLVRY — winged crucifix on the hill" />
          </div>
        </div>

        <h1 className="hero-in mt-10 w-[min(84vw,540px)] [--d:0.6s] md:mt-12">
          <Wordmark className="w-full" label="CLVRY" />
        </h1>

        <p className="mt-6 font-display text-xs uppercase tracking-[0.45em] opacity-80 md:text-sm">
          <span className="sr-only">{TAGLINE}</span>
          <span aria-hidden>
            {[...TAGLINE].map((ch, i) => (
              <span key={i} className="hero-letter" style={{ "--i": i } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </p>

        <div className="hero-in mt-12 [--d:2.3s]">
          <EarlyAccessButton className="h-12 px-9" />
        </div>
        <Socials className="hero-in mt-8 [--d:2.5s]" />
      </div>

      {/* Scroll cue */}
      <div aria-hidden className="hero-in absolute bottom-6 left-1/2 -translate-x-1/2 [--d:2.9s]">
        <div className="hero-cue relative h-14 w-px overflow-hidden bg-(--hero-ink)/20" />
      </div>
    </HeroStage>
  );
}
