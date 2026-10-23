import type { Garment } from "@/lib/schemas";

// Flat-lay silhouettes standing in for product photography.
const paths: Record<Garment, string> = {
  hoodie:
    "M76 36 Q100 8 124 36 L152 44 L180 126 L160 134 L146 92 L146 182 L54 182 L54 92 L40 134 L20 126 L48 44 Z",
  tee: "M72 32 L48 40 L18 68 L36 92 L56 80 L56 180 L144 180 L144 80 L164 92 L182 68 L152 40 L128 32 Q100 52 72 32 Z",
  pant: "M58 20 L142 20 L154 182 L112 182 L100 72 L88 182 L46 182 Z",
  cap: "M44 122 Q44 54 100 50 Q156 54 156 122 Z M40 122 Q110 112 184 132 Q178 146 156 142 Q100 132 40 134 Z",
};

const details: Partial<Record<Garment, string>> = {
  hoodie: "M84 40 Q100 62 116 40 M70 148 L130 148 L124 176 L76 176 Z",
  pant: "M58 34 L142 34",
  cap: "M100 50 L100 120",
};

export function GarmentSilhouette({ garment, className }: { garment: Garment; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {/* Faint outline keeps the black colorway readable on the dark card */}
      <path d={paths[garment]} fill="currentColor" stroke="var(--bone)" strokeOpacity={0.15} strokeWidth={1} />
      {details[garment] && (
        <path d={details[garment]} fill="none" stroke="black" strokeOpacity={0.25} strokeWidth={2} />
      )}
    </svg>
  );
}
