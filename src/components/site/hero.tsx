import { CrossMark, Wordmark } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cta = "h-12 px-8 font-mono text-[11px] uppercase tracking-[0.25em]";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center overflow-hidden px-5 py-20 text-center">
      {/* Wine glow behind the mark */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,var(--wine)_0%,transparent_60%)] opacity-(--glow)"
      />

      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gold">Coming soon</p>

      <CrossMark className="mt-10 w-[min(70vw,420px)] text-foreground" label="CLVRY winged cross" />

      <h1 className="mt-12 w-[min(80vw,560px)]">
        <Wordmark className="w-full text-foreground" label="CLVRY" />
      </h1>

      <p className="mt-6 font-display text-sm uppercase tracking-[0.4em] text-muted-foreground md:text-base">
        Christ Above All
      </p>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <a href="#notify" className={cn(buttonVariants(), cta)}>
          Get notified
        </a>
        <a href="#coming-soon" className={cn(buttonVariants({ variant: "outline" }), cta, "bg-transparent")}>
          See what&apos;s coming
        </a>
      </div>
    </section>
  );
}
