"use client";

import { useEffect, useRef } from "react";

// If the video still hasn't started by then (slow network, autoplay blocked), show the poster.
const GIVE_UP_MS = 8000;

/**
 * Owns the background video: it plays once and holds its final frame, and pauses whenever the
 * hero is off-screen or the tab is hidden. While it loads the hero stays black with a faint spinner
 * (`data-loading`, styled in globals.css); the attribute comes off once frames are playing.
 */
export function HeroStage({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const video = el?.querySelector("video");
    if (!el || !video) return;
    const loaded = () => el.removeAttribute("data-loading");

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // CSS swaps in the poster; make sure nothing downloads or plays behind it.
      video.removeAttribute("preload");
      video.pause();
      loaded();
      return;
    }

    if (video.readyState >= 3 || video.ended) loaded();
    video.addEventListener("playing", loaded, { once: true });
    video.addEventListener("error", loaded, { once: true });
    const giveUp = setTimeout(loaded, GIVE_UP_MS);

    let inView = true;
    const sync = () => {
      // Finished: hold the last frame (play() would restart it from black).
      if (video.ended) return;
      if (inView && !document.hidden) video.play().catch(loaded);
      else video.pause();
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      clearTimeout(giveUp);
      video.removeEventListener("playing", loaded);
      video.removeEventListener("error", loaded);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <section ref={ref} className={className} data-loading="">
      {/* Without JavaScript nothing clears the loading state, so skip it entirely. */}
      <noscript>
        <style>{".hero[data-loading] .hero-spinner{display:none}.hero[data-loading] .hero-still{background-image:url(/images/clvry-hero-poster.jpg)}"}</style>
      </noscript>
      <span aria-hidden className="hero-spinner" />
      {children}
    </section>
  );
}
