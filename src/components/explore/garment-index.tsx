"use client";

import Image from "next/image";
import { useState } from "react";
import type { ExploreImage } from "@/lib/explore";
import { cn } from "@/lib/utils";

export type GarmentLine = { n: string; name: string; note: string; images: readonly ExploreImage[] };

/**
 * The line, as an atelier index. From md up, pointing at (or focusing) a row swaps the sticky
 * preview beside the list; on phones each row carries its own swipeable strip instead.
 */
export function GarmentIndex({ lines }: { lines: readonly GarmentLine[] }) {
  const [active, setActive] = useState(0);
  const shown = lines[active];

  return (
    <div className="grid gap-12 md:grid-cols-12">
      <ol className="md:col-span-7">
        {lines.map((line, i) => (
          <li key={line.n} className="border-t border-border last:border-b">
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className="group flex w-full items-baseline gap-5 py-7 text-left md:gap-8 md:py-9"
            >
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.2em] transition-colors",
                  i === active ? "text-gold" : "text-muted-foreground",
                )}
              >
                {line.n}
              </span>
              <span className="flex-1">
                <span
                  className={cn(
                    "block font-display text-3xl uppercase tracking-[0.08em] transition duration-500 md:text-5xl",
                    i === active ? "text-foreground md:translate-x-2" : "text-foreground/45 group-hover:text-foreground/80",
                  )}
                >
                  {line.name}
                </span>
                <span className="mt-2 block text-sm text-muted-foreground">{line.note}</span>
              </span>
              <span
                aria-hidden
                className={cn("hidden size-1.5 rotate-45 transition md:block", i === active ? "bg-wine ring-1 ring-gold" : "bg-transparent")}
              />
            </button>

            {/* Phones: the row's own strip */}
            <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-7 md:hidden">
              {line.images.map((img) => (
                <div key={img.src} className="relative aspect-[4/5] w-[62%] shrink-0 snap-start overflow-hidden bg-ink-soft">
                  <Image src={img.src} alt={img.alt} fill sizes="62vw" className="object-cover" />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>

      {/* md+: sticky preview of the active line */}
      <div className="hidden md:col-span-5 md:block">
        <div className="sticky top-10">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft">
            {shown.images.slice(0, 1).map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                fill
                sizes="40vw"
                className="explore-frame-in object-cover"
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {shown.images.slice(1).map((img) => (
              <div key={img.src} className="explore-frame-in relative aspect-square overflow-hidden bg-ink-soft">
                <Image src={img.src} alt={img.alt} fill sizes="10vw" className="object-cover" />
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {shown.n} — {shown.name} · In the works
          </p>
        </div>
      </div>
    </div>
  );
}
