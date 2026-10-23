import { CrossMark, Wordmark } from "@/components/brand/logo";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center overflow-hidden px-5 py-20 text-center">
      {/* Wine glow behind the mark */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,var(--wine)_0%,transparent_60%)] opacity-(--glow)"
      />

      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gold">Drop 001 — Sanctuary</p>

      <CrossMark className="mt-10 w-[min(70vw,420px)] text-bone" label="CLVRY winged cross" />

      <h1 className="mt-12 w-[min(80vw,560px)]">
        <Wordmark className="w-full text-bone" label="CLVRY" />
      </h1>

      <p className="mt-6 font-display text-sm uppercase tracking-[0.4em] text-bone/70 md:text-base">
        Wear the Word
      </p>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <a
          href="#shop"
          className="bg-bone px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-ink transition hover:bg-gold"
        >
          Shop the drop
        </a>
        <a
          href="#circle"
          className="border border-bone/30 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] transition hover:border-gold hover:text-gold"
        >
          Enter the circle
        </a>
      </div>
    </section>
  );
}
