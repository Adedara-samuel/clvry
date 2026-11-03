"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CrossMark } from "@/components/brand/logo";
import { exploreSections, type ExploreImage } from "@/lib/explore";
import { cn } from "@/lib/utils";

// Four frames from md up, three on phones (the fourth is hidden).
const FRAMES = 4;
const TURN_MS = 4200;

type Slot = { image: ExploreImage; under?: ExploreImage; turn: number };

function pick(pool: readonly ExploreImage[], showing: Set<string>) {
  const fresh = pool.filter((img) => !showing.has(img.src));
  const from = fresh.length ? fresh : pool;
  return from[Math.floor(Math.random() * from.length)];
}

/**
 * Minimal header banner: a row of frames cut from the section's moodboard with the section name
 * set over them. A fresh random hand is dealt on every visit (client-side, after hydration, so
 * server and client markup match), then one frame turns over every few seconds.
 */
export function ExploreBanner({
  index,
  name,
  line,
  images,
}: {
  index: string;
  name: string;
  line: string;
  images: readonly ExploreImage[];
}) {
  const [slots, setSlots] = useState<Slot[] | null>(null);

  useEffect(() => {
    const deal = requestAnimationFrame(() => {
      const showing = new Set<string>();
      setSlots(
        Array.from({ length: FRAMES }, () => {
          const image = pick(images, showing);
          showing.add(image.src);
          return { image, turn: 0 };
        }),
      );
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => cancelAnimationFrame(deal);
    }
    const timer = setInterval(() => {
      setSlots((prev) => {
        if (!prev) return prev;
        const at = Math.floor(Math.random() * prev.length);
        const image = pick(images, new Set(prev.map((s) => s.image.src)));
        return prev.map((s, i) => (i === at ? { image, under: s.image, turn: s.turn + 1 } : s));
      });
    }, TURN_MS);
    return () => {
      cancelAnimationFrame(deal);
      clearInterval(timer);
    };
  }, [images]);

  return (
    <header className="relative isolate h-[40svh] max-h-[540px] min-h-72 overflow-hidden border-b border-border bg-ink-soft">
      <div aria-hidden className="absolute inset-0 -z-20 grid grid-cols-3 gap-px bg-background md:grid-cols-4">
        {Array.from({ length: FRAMES }, (_, i) => {
          const slot = slots?.[i];
          return (
            <div key={i} className={cn("relative overflow-hidden bg-ink-soft", i === FRAMES - 1 && "hidden md:block")}>
              {slot?.under && (
                <Image src={slot.under.src} alt="" fill sizes="(min-width: 768px) 25vw, 34vw" className="object-cover" />
              )}
              {slot && (
                <Image
                  key={slot.turn}
                  src={slot.image.src}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(min-width: 768px) 25vw, 34vw"
                  // The first hand fans in left to right; later turns fade in on their own.
                  style={slot.turn === 0 ? { animationDelay: `${i * 140}ms` } : undefined}
                  className="explore-frame-in object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Wash so the title reads on any frame, in either theme */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/55 to-background/5"
      />

      <div className="flex items-start justify-between px-5 pt-5 md:px-10 md:pt-8">
        <Link href="/" aria-label="CLVRY home" className="text-gold md:hidden">
          <CrossMark className="w-9" />
        </Link>
        <p className="ml-auto font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80">
          Explore — N° {index} / {String(exploreSections.length).padStart(2, "0")}
        </p>
      </div>

      <div className="explore-rise absolute inset-x-0 bottom-0 px-5 pb-6 md:px-10 md:pb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">This is</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-none tracking-[0.12em] md:text-8xl">{name}</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/75 md:text-base">{line}</p>
      </div>
    </header>
  );
}
