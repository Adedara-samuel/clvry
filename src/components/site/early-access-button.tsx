"use client";

import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";

/** Glass-prism CTA that opens the early-access popup. */
export function EarlyAccessButton({ className, children = "Become a member" }: { className?: string; children?: React.ReactNode }) {
  const showPopup = useUi((s) => s.showPopup);
  return (
    <button
      type="button"
      onClick={showPopup}
      aria-haspopup="dialog"
      className={cn(
        "btn-prism inline-flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.25em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {children}
    </button>
  );
}
