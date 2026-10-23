"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscribe } from "@/lib/queries";
import { subscribeSchema } from "@/lib/schemas";
import { useUi } from "@/store/ui";

/** Email sign-up used by both the page section and the popup. Meant for wine surfaces. */
export function NewsletterForm({ onSubscribed }: { onSubscribed?: () => void }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const subscribe = useSubscribe();
  const subscribed = useUi((s) => s.subscribed);
  const markSubscribed = useUi((s) => s.markSubscribed);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = subscribeSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setError(null);
    subscribe.mutate(parsed.data, {
      onSuccess: () => {
        setEmail("");
        markSubscribed();
        toast.success("You're on the list. Grace and peace.");
        onSubscribed?.();
      },
      onError: (err) => toast.error(err.message),
    });
  }

  if (subscribed) {
    return (
      <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-goldenrod">You&apos;re in. Grace and peace.</p>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <Label htmlFor={id} className="sr-only">
          Email address
        </Label>
        <Input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 flex-1 border-paper/30 bg-transparent text-paper placeholder:text-paper/50 focus-visible:border-goldenrod focus-visible:ring-goldenrod/40 dark:bg-transparent"
        />
        <Button
          type="submit"
          disabled={subscribe.isPending}
          className="h-12 bg-goldenrod px-6 font-mono text-[11px] uppercase tracking-[0.25em] text-night hover:bg-paper"
        >
          {subscribe.isPending ? "Joining…" : "Join"}
        </Button>
      </form>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-3 text-sm text-paper">
          {error}
        </p>
      )}
    </>
  );
}
