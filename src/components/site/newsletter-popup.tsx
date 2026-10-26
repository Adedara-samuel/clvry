"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useUi } from "@/store/ui";
import { NewsletterForm } from "./newsletter-form";
import { Socials } from "./socials";

// Long enough for the hero's opening sequence (≈4.6s) to finish before the dialog covers it.
const POPUP_DELAY_MS = 5500;

/**
 * Minimal "Get early access" popup. Opens once the hero's opening sequence has played, and
 * whenever a "Get early access" button is pressed. Skipped if the visitor already subscribed;
 * once closed it won't auto-open again until the page is refreshed.
 */
export function NewsletterPopup() {
  const open = useUi((s) => s.popupOpen);
  const openPopup = useUi((s) => s.openPopup);
  const dismissPopup = useUi((s) => s.dismissPopup);

  useEffect(() => {
    const timer = setTimeout(openPopup, POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [openPopup]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismissPopup()}>
      <DialogContent className="gap-0 rounded-none bg-background p-8 text-foreground ring-1 ring-border sm:max-w-sm sm:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">CLVRY</p>
        <DialogTitle className="mt-3 font-display text-2xl font-normal uppercase">Get early access</DialogTitle>
        <DialogDescription className="mt-3 text-sm leading-relaxed">
          The shop and the album are coming soon. Be the first to know.
        </DialogDescription>
        <NewsletterForm variant="plain" onSubscribed={() => setTimeout(dismissPopup, 1800)} />
        <Socials className="mt-8 justify-start" />
      </DialogContent>
    </Dialog>
  );
}
