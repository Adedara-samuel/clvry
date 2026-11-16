"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import content from "@/content/site.json";
import type { SiteContent } from "@/lib/content-schema";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";
import { NewsletterForm } from "./newsletter-form";
import { Socials } from "./socials";

// Copy and timings live in src/content/site.json (edited at /admin/content).
const popup = (content as SiteContent).popup;
// The default 5.5s is long enough for the hero's opening sequence (≈4.6s) to finish before the
// dialog covers it.
const POPUP_DELAY_MS = popup.delaySeconds * 1000;
// On the Explore pages it comes back this long after each close.
const EXPLORE_REPEAT_MS = popup.exploreRepeatMinutes * 60 * 1000;

// Pages where the popup never appears.
const quietPaths = ["/admin", "/unsubscribe"];

/**
 * Minimal "Become a member" popup, mounted once in the root layout. On the landing page it opens
 * once the hero's opening sequence has played and won't auto-open again after it's closed; on the
 * Explore pages it returns a couple of minutes after every close. "Subscribe" buttons always open it,
 * and nothing opens it on its own once the visitor has subscribed or when it's switched off in the admin.
 */
export function NewsletterPopup() {
  const pathname = usePathname();
  const exploring = pathname.startsWith("/explore");
  const quiet = quietPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const open = useUi((s) => s.popupOpen);
  const openPopup = useUi((s) => s.openPopup);
  const nudgePopup = useUi((s) => s.nudgePopup);
  const dismissPopup = useUi((s) => s.dismissPopup);

  useEffect(() => {
    if (open || quiet || !popup.enabled) return;
    // Re-armed on every close, so on Explore the wait counts from the last dismissal.
    const timer = exploring ? setTimeout(nudgePopup, EXPLORE_REPEAT_MS) : setTimeout(openPopup, POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open, quiet, exploring, openPopup, nudgePopup]);

  if (quiet) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismissPopup()}>
      <DialogContent className="gap-0 rounded-none bg-background p-8 text-foreground ring-1 ring-border sm:max-w-xl sm:p-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">CLVRY</p>
        <DialogTitle className="mt-3 font-display text-2xl font-normal uppercase">{popup.title}</DialogTitle>
        {/* Short lines stay on one line from sm up (the dialog is wide enough); phones still wrap. */}
        <DialogDescription
          className={cn("mt-3 text-sm leading-relaxed", popup.description.length <= 60 && "sm:whitespace-nowrap")}
        >
          {popup.description}
        </DialogDescription>

        {popup.perks.length > 0 && (
          <ul className="mt-6 flex flex-col gap-2.5 border-l border-gold/40 pl-4 text-sm text-foreground/85">
            {popup.perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-3">
                <span aria-hidden className="size-1 shrink-0 rotate-45 bg-gold" />
                {perk}
              </li>
            ))}
          </ul>
        )}

        <NewsletterForm variant="plain" withPhone onSubscribed={() => setTimeout(dismissPopup, 1800)} />
        <Socials className="mt-8 justify-start" />
      </DialogContent>
    </Dialog>
  );
}
