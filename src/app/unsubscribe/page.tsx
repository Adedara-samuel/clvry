import type { Metadata } from "next";
import { Suspense } from "react";
import { UnsubscribeForm } from "@/components/site/unsubscribe-form";
import { CrossMark } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Unsubscribe — CLVRY",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-md text-center">
        <CrossMark className="mx-auto w-14 text-gold" />
        <h1 className="mt-8 font-display text-2xl uppercase tracking-[0.08em]">Leave the list</h1>
        <Suspense>
          <UnsubscribeForm />
        </Suspense>
      </div>
    </main>
  );
}
