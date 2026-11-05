import type { ExploreImage } from "@/lib/explore";
import { cn } from "@/lib/utils";
import { Shot } from "./shot";

const pad = (n: number) => String(n).padStart(2, "0");

/** Eyebrow + title + side note, shared by the rails and boards. */
export function GalleryHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— {eyebrow}</p>
        <h2 className="mt-4 font-display text-3xl uppercase md:text-5xl">{title}</h2>
      </div>
      {note && <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{note}</p>}
    </div>
  );
}

/** A full-bleed horizontal rail that snaps frame by frame. */
export function ExploreRail({
  eyebrow,
  title,
  note,
  images,
  label,
  className,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  images: readonly ExploreImage[];
  /** Caption prefix, numbered from 01 */
  label: string;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-border py-20 md:py-32", className)}>
      <div className="px-5 md:px-12">
        <GalleryHeading eyebrow={eyebrow} title={title} note={note} />
      </div>
      <ol className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mt-16 md:gap-6 md:px-12">
        {images.map((image, i) => (
          <li key={image.src} className="w-[72vw] shrink-0 snap-start md:w-[26vw]">
            <Shot
              image={image}
              crop="aspect-[3/4]"
              caption={`${label} ${pad(i + 1)}`}
              sizes="(min-width: 768px) 26vw, 72vw"
              reveal={false}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

/** A masonry board: every image at its own proportions, numbered like plates in a book. */
export function ExploreBoard({
  images,
  label = "Fig.",
  className,
}: {
  images: readonly ExploreImage[];
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4", className)}>
      {images.map((image, i) => (
        <Shot
          key={image.src}
          image={image}
          caption={`${label} ${pad(i + 1)}`}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="mb-6 break-inside-avoid md:mb-8"
        />
      ))}
    </div>
  );
}
