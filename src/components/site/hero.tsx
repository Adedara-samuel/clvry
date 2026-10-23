import { CrossMark, Wordmark } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cta = "h-12 px-8 font-mono text-[11px] uppercase tracking-[0.25em]";

export function Hero() {
  return (
    <PointerStage className="relative isolate flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center overflow-hidden px-5 py-20 text-center">
      {/* Wine glow behind the mark */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,var(--wine)_0%,transparent_60%)] opacity-(--glow)"
      />
      {/* Gold light that follows the pointer (--mx/--my come from PointerStage) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(520px circle at calc(50% + var(--mx, 0) * 45%) calc(42% + var(--my, 0) * 45%), color-mix(in srgb, var(--goldenrod) 16%, transparent), transparent 65%)",
        }}
      />

      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gold">Coming soon</p>

      {/* The cross turns to face the visitor, and floats when they're still */}
      <div className="hero-float mt-10 w-[min(70vw,420px)]">
        <div
          className="will-change-transform"
          style={{
            transform:
              "perspective(1000px) rotateY(calc(var(--mx, 0) * 16deg)) rotateX(calc(var(--my, 0) * -12deg)) translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 10px), 0)",
          }}
        >
          <CrossMark className="w-full text-foreground" label="CLVRY winged cross" />
        </div>
      </div>

      {/* Wordmark drifts the opposite way for depth */}
      <h1
        className="mt-12 w-[min(80vw,560px)]"
        style={{ transform: "translate3d(calc(var(--mx, 0) * -8px), calc(var(--my, 0) * -5px), 0)" }}
      >
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
