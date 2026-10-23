import { cn } from "@/lib/cn";

type MarkProps = { className?: string; label?: string };

// Each mark is the original artwork used as an alpha mask, so it renders
// pixel-identical to the source files and inherits `color` (text-gold, text-fire…).
function BrandMask({
  src,
  ratio,
  className,
  label,
}: MarkProps & { src: string; ratio: string }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("brand-mask block", className)}
      style={{ aspectRatio: ratio, maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
    />
  );
}

/** Winged crucifix on the hill. */
export function CrossMark(props: MarkProps) {
  return <BrandMask src="/brand/mark.png" ratio="741 / 615" {...props} />;
}

/** CLVRY lettering inside the heart. */
export function HeartLogo(props: MarkProps) {
  return <BrandMask src="/brand/heart.png" ratio="773 / 378" {...props} />;
}

/** The CLVRY serif wordmark. */
export function Wordmark(props: MarkProps) {
  return <BrandMask src="/brand/wordmark.png" ratio="760 / 172" {...props} />;
}
