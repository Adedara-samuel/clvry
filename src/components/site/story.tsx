import { CrossMark } from "@/components/brand/logo";

export function Story() {
  return (
    <section id="story" className="border-y border-border">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-wine md:aspect-auto">
          <CrossMark className="w-2/3 text-night/70" />
          <span className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.3em] text-goldenrod">
            Calvary, the place of the skull
          </span>
        </div>
        <div className="flex flex-col justify-center gap-8 px-5 py-20 md:px-16 md:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gold">The name</p>
          <h2 className="font-display text-3xl uppercase leading-tight md:text-5xl">
            Carried from the hill
            <br /> into the street.
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground">
            CLVRY takes its name from Calvary — where everything was paid for. We make plain, heavy
            clothes for people who carry that with them: to the block, the studio, the sanctuary.
            No noise. Just the Word, worn.
          </p>
          <blockquote className="border-l-2 border-fire pl-5 font-display">
            “But God forbid that I should glory, save in the cross.”
            <cite className="mt-2 block font-mono text-[11px] not-italic uppercase tracking-[0.25em] text-muted-foreground">
              Galatians 6:14
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
