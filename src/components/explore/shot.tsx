import Image from "next/image";
import type { ExploreImage } from "@/lib/explore";
import { cn } from "@/lib/utils";

/**
 * A moodboard image with an optional mono caption. Pass `crop` (an aspect-ratio class) to cut it
 * to a fixed frame; otherwise it keeps its own proportions.
 */
export function Shot({
  image,
  caption,
  crop,
  sizes = "(min-width: 768px) 50vw, 100vw",
  className,
}: {
  image: ExploreImage;
  caption?: React.ReactNode;
  crop?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={cn("reveal group", className)}>
      <div className={cn("overflow-hidden bg-ink-soft", crop)}>
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          sizes={sizes}
          className={cn(
            "w-full transition duration-1000 ease-out group-hover:scale-[1.03]",
            crop ? "h-full object-cover" : "h-auto",
          )}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
