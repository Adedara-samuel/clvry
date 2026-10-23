import { cn } from "@/lib/utils";

/*
 * The CLVRY emblem (cross through the oval, serif C inside), redrawn as vectors from the
 * brand artwork so the C can be animated on its own layer. Both layers share one viewBox.
 */
export const EMBLEM_VIEWBOX = "0 0 335 480";

/** Oval ring + flared cross. The shaft stops where the C sits, as in the artwork. */
export const RING_AND_CROSS = [
  // Oval: thick on the sides, thin top and bottom
  "M168.5 147a161.5 165 0 1 0 0.01 0Z M168.5 157a121 155 0 1 1 -0.01 0Z",
  // Shaft, top segment with a flared cap
  "M128 0H210L191 20V222H147V20Z",
  // Shaft, bottom segment
  "M147 403H191V466H147Z",
  // Crossbar
  "M60 70H278V103H60Z",
  // Flared bar ends
  "M43 55L62 72V101L43 118Z",
  "M295 55L276 72V101L295 118Z",
].join(" ");

/** The serif C (heavy left stroke, light right, vertical serifs at both terminals). */
export const LETTER_C = [
  // Bowl: outer ellipse minus an off-centre inner ellipse, with the mouth cut by the clip below
  "M156 219a91 93 0 1 0 0.01 0Z M166 226a62 86 0 1 1 -0.01 0Z",
].join(" ");

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
        <path d={RING_AND_CROSS} fillRule="evenodd" />
      </svg>
      <svg
        viewBox={EMBLEM_VIEWBOX}
        className={cn("absolute inset-0 size-full [transform-origin:46.6%_65%]", letterClassName)}
        fill="currentColor"
      >
        <defs>
          <clipPath id="clvry-c-mouth">
            {/* Everything except the C's opening on the right */}
            <path d="M0 0H335V480H0Z M206 270H262V354H206Z" clipRule="evenodd" fillRule="evenodd" />
          </clipPath>
        </defs>
        <path d={LETTER_C} fillRule="evenodd" clipPath="url(#clvry-c-mouth)" />
        {/* Terminal serifs */}
        <path d="M204 262L246 248V284L204 276Z" />
        <path d="M204 348L246 340V376L204 362Z" />
      </svg>
    </div>
  );
}
