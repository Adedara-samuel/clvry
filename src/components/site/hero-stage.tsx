"use client";

import { useEffect, useRef } from "react";
import { whenIntroDone } from "@/lib/intro";

// Spring for the cursor parallax: stiffness pulls toward the cursor, damping bleeds off velocity.
const STIFFNESS = 0.045;
const DAMPING = 0.82;

/**
 * Drives the hero's motion through CSS variables so React never re-renders on movement:
 *   --mx / --my  spring-eased pointer position, -1…1 (0 = centre). Fine pointers only.
 *   --p          scroll progress through the hero, 0 (top) … 1 (scrolled past).
 * Also owns the background video: it waits for the intro screen to lift so the opening plays
 * in view, then loops, and pauses whenever the hero is off-screen or the tab is hidden.
 */
export function HeroStage({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const video = el?.querySelector("video");
    if (!el || !video) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // CSS swaps in the poster; make sure nothing downloads or plays behind it.
      video.removeAttribute("preload");
      video.pause();
      return;
    }

    // ---- Video: start after the intro, pause off-screen ----
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

    // ---- Scroll progress ----
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / r.height));
        el.style.setProperty("--p", p.toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---- Cursor parallax (desktop / fine pointers only) ----
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      for (const k of ["x", "y"] as const) {
        vel[k] = (vel[k] + (target[k] - pos[k]) * STIFFNESS) * DAMPING;
        pos[k] += vel[k];
      }
      el.style.setProperty("--mx", pos.x.toFixed(4));
      el.style.setProperty("--my", pos.y.toFixed(4));
      const moving =
        Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) + Math.abs(vel.x) + Math.abs(vel.y) > 0.0005;
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = clamp((e.clientX / innerWidth) * 2 - 1);
      target.y = clamp((e.clientY / innerHeight) * 2 - 1);
      kick();
    };
    const onLeave = () => {
      target.x = target.y = 0;
      kick();
    };
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stopIntroWatch();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
