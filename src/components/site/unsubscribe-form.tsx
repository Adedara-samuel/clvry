"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type State = { kind: "idle" } | { kind: "pending" } | { kind: "done"; email: string } | { kind: "error"; message: string };

/** Confirms before unsubscribing, so link scanners that open URLs don't take people off the list. */
export function UnsubscribeForm() {
  const params = useSearchParams();
  const e = params.get("e");
  const t = params.get("t");
  const [state, setState] = useState<State>({ kind: "idle" });

  if (!e || !t) {
    return (
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Use the unsubscribe link at the bottom of any CLVRY email, or just reply to one and we&rsquo;ll take you off.
      </p>
    );
  }

  async function confirm() {
    setState({ kind: "pending" });
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ e, t }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; email?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setState({ kind: "done", email: data.email ?? "" });
    } catch (error) {
      setState({ kind: "error", message: (error as Error).message });
    }
  }

  if (state.kind === "done") {
    return (
      <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          <span className="text-foreground">{state.email}</span> won&rsquo;t get CLVRY emails any more.
        </p>
        <p className="mt-2">Changed your mind? Sign up again on the site any time. Grace and peace.</p>
        <Link href="/" className="mt-8 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-gold hover:underline">
          Back to CLVRY
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm leading-relaxed text-muted-foreground">You&rsquo;ll stop getting CLVRY emails: drops, events and news.</p>
      <Button onClick={confirm} disabled={state.kind === "pending"} className="mt-8 h-11 rounded-none px-8 font-mono text-[10px] uppercase tracking-[0.25em]">
        {state.kind === "pending" ? "One moment…" : "Unsubscribe"}
      </Button>
      {state.kind === "error" && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {state.message}
        </p>
      )}
    </div>
  );
}
