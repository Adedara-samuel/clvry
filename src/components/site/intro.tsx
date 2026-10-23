"use client";

import { useEffect } from "react";
import { Emblem } from "@/components/brand/emblem";
import { INTRO_KEY } from "@/lib/intro";

function finish() {
  document.documentElement.dataset.intro = "seen";
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
}

/**
 * Loading screen: the CLVRY emblem rises in with the C turning on its axis inside the oval,
 * over a slow wine glow, with a hairline filling underneath; then the screen lifts away.
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
      <div aria-hidden className="intro-glow absolute size-[min(90vw,520px)] rounded-full" />

      <Emblem className="intro-emblem relative w-[min(30vw,120px)] text-goldenrod" letterClassName="intro-spin" />

      <div className="relative mt-12 h-px w-[min(40vw,140px)] overflow-hidden bg-paper/10">
        <div className="intro-progress absolute inset-0 bg-goldenrod" />
      </div>
    </div>
  );
}
