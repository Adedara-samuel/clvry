"use client";

import { useEffect, useRef } from "react";
import { whenIntroDone } from "@/lib/intro";

/**
 * Owns the looping background video: it waits for the intro screen to lift so the opening plays
 * in view, and pauses whenever the hero is off-screen or the tab is hidden.
 */
export function HeroStage({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const video = el?.querySelector("video");
    if (!el || !video) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // CSS swaps in the poster; make sure nothing downloads or plays behind it.
      video.removeAttribute("preload");
      video.pause();
      return;
    }

    let introDone = false;
    let inView = true;
    const sync = () => {
      if (introDone && inView && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const stopIntroWatch = whenIntroDone(() => {
      introDone = true;
      video.currentTime = 0;
      sync();
    });
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stopIntroWatch();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
