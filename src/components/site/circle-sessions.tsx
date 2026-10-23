"use client";

import { HeartLogo } from "@/components/brand/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { useTracks } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";

export function CircleSessions() {
  const { data: tracks, isPending } = useTracks();
  const activeTrackId = useUi((s) => s.activeTrackId);
  const playing = useUi((s) => s.playing);
  const toggleTrack = useUi((s) => s.toggleTrack);

  return (
    <section id="circle" className="mx-auto grid w-full max-w-7xl items-center gap-16 px-5 py-28 md:grid-cols-2 md:px-8">
      {/* The record: spins while a track is "playing" */}
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <div
          className={cn(
            "animate-spin-slow absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,#111_0px,#111_2px,#1b1919_3px,#111_4px)] shadow-[0_0_80px_-20px_var(--wine)]",
            !playing && "[animation-play-state:paused]",
          )}
        >
          <div className="absolute inset-[32%] flex items-center justify-center rounded-full bg-wine">
            <HeartLogo className="w-3/4 text-goldenrod" />
          </div>
          <div className="absolute left-1/2 top-1/2 size-3 -translate-1/2 rounded-full bg-night" />
        </div>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gold">Circle Sessions · Vol. 01</p>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-5xl">Music for the circle</h2>
        <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
          Live worship recorded in the round — no stage, no front row. Godly sound from the people who
          wear the cross. First volume streaming soon.
        </p>

        <ol className="mt-10 divide-y divide-border border-y border-border">
          {isPending
            ? Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="py-4">
                  <Skeleton className="h-6" />
                </li>
              ))
            : tracks?.map((t) => {
                const active = t.id === activeTrackId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => toggleTrack(t.id)}
                      aria-pressed={active && playing}
                      className="group flex w-full items-center gap-5 py-4 text-left"
                    >
                      <span className={cn("w-6 font-mono text-xs", active ? "text-gold" : "text-muted-foreground")}>
                        {active && playing ? "❚❚" : t.id}
                      </span>
                      <span className={cn("flex-1 uppercase tracking-wide transition group-hover:text-gold", active && "text-gold")}>
                        {t.title}
                      </span>
                      <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                        {t.scripture}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{t.duration}</span>
                    </button>
                  </li>
                );
              })}
        </ol>
      </div>
    </section>
  );
}
