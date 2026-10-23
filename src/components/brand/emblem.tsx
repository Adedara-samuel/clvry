import { cn } from "@/lib/utils";

/*
 * The CLVRY emblem (cross through the oval, serif C inside), cut from
 * public/brand/clvry-c-logo.jpeg into two alpha masks on the same 329×482 canvas so the C
 * can be animated on its own layer. Like the other brand marks, both take `color`.
 */
function Layer({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={cn("brand-mask absolute inset-0", className)}
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
    />
  );
}

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
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative block aspect-329/482", className)}
    >
      <Layer src="/brand/emblem-ring.png" />
      {/* The C pivots on its own centre (measured from the artwork) */}
      <Layer src="/brand/emblem-c.png" className={cn("origin-[45.9%_65.8%]", letterClassName)} />
    </span>
  );
}
