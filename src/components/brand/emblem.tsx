import { cn } from "@/lib/utils";

/*
 * The CLVRY emblem (cross through the oval, serif C inside), redrawn as vectors from the
 * brand artwork so the C can be animated on its own layer. All layers share one viewBox.
 */
export const EMBLEM_VIEWBOX = "0 0 335 480";

/** Oval ring: thick on the sides, thin top and bottom (fill-rule evenodd). */
export const RING = "M168.5 147a161.5 165 0 1 0 0.01 0Z M168.5 157a121 155 0 1 1 -0.01 0Z";

/** Flared cross. The shaft stops where the C sits, as in the artwork. */
export const CROSS = [
  "M128 0H210L191 20V222H147V20Z", // shaft, top segment with flared cap
  "M147 403H191V466H147Z", // shaft, bottom segment
  "M60 70H278V103H60Z", // crossbar
  "M43 55L64 72V101L43 118Z", // flared left end
  "M295 55L274 72V101L295 118Z", // flared right end
].join(" ");

/** Serif C: heavy left stroke, hairline arms, vertical serifs at both terminals. */
export const LETTER_C =
  "M248 222V276H240C232 252 205 234 168 234C128 234 106 270 106 312C106 356 128 390 168 390C205 390 232 372 240 348H248V404C225 400 195 405 160 405C105 405 65 365 65 312C65 259 105 219 160 219C195 219 225 224 248 222Z";

export function Emblem({
  className,
  label,
  letterClassName,
}: {
  className?: string;
  label?: string;
  /** Extra classes for the C layer (e.g. a spin animation). */
  letterClassName?: string;
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative aspect-335/480", className)}
    >
      <svg viewBox={EMBLEM_VIEWBOX} className="absolute inset-0 size-full" fill="currentColor">
        <path d={RING} fillRule="evenodd" />
        <path d={CROSS} />
      </svg>
      {/* The C on its own layer, pivoting on its own centre */}
      <svg
        viewBox={EMBLEM_VIEWBOX}
        className={cn("absolute inset-0 size-full origin-[46.6%_65%]", letterClassName)}
        fill="currentColor"
      >
        <path d={LETTER_C} />
      </svg>
    </div>
  );
}
