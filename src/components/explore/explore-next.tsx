import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { EarlyAccessButton } from "@/components/site/early-access-button";
import { exploreSections, type ExploreSlug } from "@/lib/explore";

/** Closes every Explore page: a sign-up nudge beside a large link on to the next section. */
export function ExploreNext({ current }: { current: ExploreSlug }) {
  const at = exploreSections.findIndex((s) => s.slug === current);
  const last = at === exploreSections.length - 1;
  const next = exploreSections[(at + 1) % exploreSections.length];

  return (
    <section className="grid border-t border-border md:grid-cols-2">
      <div className="flex flex-col justify-center gap-5 border-b border-border px-5 py-16 md:border-r md:border-b-0 md:px-12 md:py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Stay close</p>
        <h2 className="font-display text-2xl uppercase leading-tight md:text-4xl">Many exciting things to come.</h2>
        <p className="max-w-sm leading-relaxed text-muted-foreground">
          Be the first to know when the doors open: drops, sounds and gatherings.
        </p>
        <EarlyAccessButton className="mt-2 h-12 w-fit px-9">Subscribe</EarlyAccessButton>
      </div>

      <Link
        href={next.href}
        className="group flex flex-col justify-center gap-4 px-5 py-16 transition-colors duration-500 hover:bg-wine md:px-12 md:py-24"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground transition-colors group-hover:text-paper/70">
          {last ? "Begin again" : "Continue"}
          <span className="hidden md:inline"> — N° {next.index}</span>
        </p>
        <p className="font-display text-5xl uppercase leading-none tracking-[0.12em] transition-colors group-hover:text-paper md:text-7xl">
          {next.name}
        </p>
        <ArrowRightIcon
          strokeWidth={1.25}
          className="size-7 text-gold transition duration-500 group-hover:translate-x-3 group-hover:text-goldenrod"
        />
      </Link>
    </section>
  );
}
