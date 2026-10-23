"use client";

import { useEffect } from "react";
import { CrossMark } from "@/components/brand/logo";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useUi } from "@/store/ui";
import { NewsletterForm } from "./newsletter-form";

const POPUP_DELAY_MS = 2 * 60 * 1000;

/**
 * Same sign-up as the #notify section, offered as a popup 2 minutes after the page loads.
 * Skipped if the visitor already subscribed; once closed it stays away until the next refresh.
 */
export function NewsletterPopup() {
  const open = useUi((s) => s.popupOpen);
  const openPopup = useUi((s) => s.openPopup);
  const dismissPopup = useUi((s) => s.dismissPopup);

  useEffect(() => {
    const t = setTimeout(openPopup, POPUP_DELAY_MS);
    return () => clearTimeout(t);
  }, [openPopup]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismissPopup()}>
      <DialogContent className="overflow-hidden rounded-none border-0 bg-wine p-0 text-paper ring-0 sm:max-w-lg [&>[data-slot=dialog-close]]:text-paper/70 [&>[data-slot=dialog-close]]:hover:bg-paper/10 [&>[data-slot=dialog-close]]:hover:text-paper">
        <div className="h-1 bg-fire" />
        <div className="flex flex-col items-center px-6 pt-10 pb-12 text-center sm:px-10">
          <CrossMark className="w-16 text-goldenrod" />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.35em] text-goldenrod">The list</p>
          <DialogTitle className="mt-3 font-display text-2xl font-normal uppercase leading-tight sm:text-3xl">
            First to the drop.
            <br />
            First in the circle.
          </DialogTitle>
          <DialogDescription className="mt-4 max-w-sm text-sm text-paper/70">
            The shop, Circle Sessions and the Album are coming soon. Leave your email and we&apos;ll tell you
            the moment they open.
          </DialogDescription>
          <NewsletterForm onSubscribed={() => setTimeout(dismissPopup, 1800)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
