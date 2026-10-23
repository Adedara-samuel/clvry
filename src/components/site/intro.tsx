"use client";

import { useEffect } from "react";
import { CrossMark } from "@/components/brand/logo";
import { INTRO_KEY } from "@/lib/intro";

function finish() {
  document.documentElement.dataset.intro = "seen";
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
}

/**
 * Loading screen: the cross is raised from the hill, then the road runs out to the street.
 * Server-rendered and driven purely by CSS (see globals.css) so it covers the page before
 * hydration; JS only unlocks scrolling and remembers it for the session.
 */
export function Intro() {
  // Safety net in case animationend never fires (e.g. tab hidden during the intro).
  useEffect(() => {
    const t = setTimeout(finish, 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="intro fixed inset-0 z-100 flex flex-col items-center justify-center bg-night px-6 text-paper"
      role="status"
      aria-label="Loading CLVRY"
      onAnimationEnd={(e) => {
        if (e.animationName === "intro-exit") finish();
      }}
    >
      <CrossMark className="intro-mark w-[min(48vw,220px)] text-goldenrod" />

      <p className="mt-10 text-center font-display text-2xl uppercase leading-tight tracking-[0.15em] md:text-4xl">
        <span className="intro-line block [animation-delay:0.9s]">Bring Christ</span>
        <span className="intro-line block text-goldenrod [animation-delay:1.3s]">to the street</span>
      </p>

      {/* The street */}
      <div className="relative mt-10 h-px w-[min(70vw,320px)] bg-paper/15">
        <div className="intro-road absolute inset-x-0 -top-px h-0.75" />
        <div className="intro-progress absolute inset-0 -top-px h-0.75 bg-fire" />
      </div>

      <p className="intro-line mt-5 font-mono text-[10px] uppercase tracking-[0.35em] text-paper/50 [animation-delay:1.7s]">
        From the hill · to the block
      </p>
    </div>
  );
}
