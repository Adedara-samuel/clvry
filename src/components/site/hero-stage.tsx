"use client";

import { useEffect, useRef } from "react";

/**
 * Owns the background video: it plays once and holds its final frame, and pauses whenever the
 * hero is off-screen or the tab is hidden.
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

    let inView = true;
    const sync = () => {
      // Finished: hold the last frame (play() would restart it from black).
      if (video.ended) return;
      if (inView && !document.hidden) video.play().catch(() => {});
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
