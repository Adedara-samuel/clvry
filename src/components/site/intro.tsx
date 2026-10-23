"use client";

import { useEffect } from "react";
import { Emblem } from "@/components/brand/emblem";

// Marks the intro as done: hides it, unlocks scrolling, and lets the popup timer start.
function finish() {
  document.documentElement.dataset.intro = "seen";
}

/**
 * Loading screen, shown on every page load: the CLVRY emblem settles in with the C spinning
 * steadily inside the oval, on cream with a soft gold glow and a hairline filling underneath;
 * then the screen lifts away. Server-rendered and driven purely by CSS (see globals.css) so it
 * covers the page before hydration.
 */
export function Intro() {
  // Safety net in case animationend never fires (e.g. tab hidden during the intro).
  useEffect(() => {
    const t = setTimeout(finish, 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="intro fixed inset-0 z-100 flex flex-col items-center justify-center bg-paper px-6 text-night"
      role="status"
      aria-label="Loading CLVRY"
      onAnimationEnd={(e) => {
        if (e.animationName === "intro-exit") finish();
      }}
    >
      <div aria-hidden className="intro-glow absolute size-[min(90vw,520px)] rounded-full" />

      <Emblem className="intro-emblem relative w-[min(38vw,150px)] text-antique" letterClassName="intro-spin" />

      <div className="relative mt-12 h-px w-[min(40vw,140px)] overflow-hidden bg-night/10">
        <div className="intro-progress absolute inset-0 bg-antique" />
      </div>
    </div>
  );
}
