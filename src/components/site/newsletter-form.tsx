"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscribe } from "@/lib/queries";
import { subscribeSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";

const styles = {
  // On the wine #notify band
  wine: {
    form: "mx-auto mt-10 max-w-md gap-3 sm:flex-row",
    input:
      "h-12 flex-1 border-paper/30 bg-transparent text-paper placeholder:text-paper/50 focus-visible:border-goldenrod focus-visible:ring-goldenrod/40 dark:bg-transparent",
    button: "h-12 bg-goldenrod px-6 text-night hover:bg-paper",
    done: "mt-10 text-goldenrod",
    error: "text-paper",
  },
  // Minimal, theme-aware (the popup): underlined field, plain button
  plain: {
    form: "mt-8 gap-4",
    input:
      "h-11 rounded-none border-0 border-b border-foreground/30 bg-transparent px-0 text-base shadow-none placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-0 dark:bg-transparent",
    button: "h-11 w-full",
    done: "mt-8 text-gold",
    error: "text-destructive",
  },
};

/** Email sign-up used by both the page section (`wine`) and the popup (`plain`). */
export function NewsletterForm({
  onSubscribed,
  variant = "wine",
}: {
  onSubscribed?: () => void;
  variant?: keyof typeof styles;
}) {
  const look = styles[variant];
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
      <p className={cn("font-mono text-xs uppercase tracking-[0.25em]", s.done)}>You&apos;re in. Grace and peace.</p>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className={cn("flex w-full flex-col", s.form)}>
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
          className={s.input}
        />
        <Button
          type="submit"
          disabled={subscribe.isPending}
          className={cn("font-mono text-[11px] uppercase tracking-[0.25em]", s.button)}
        >
          {subscribe.isPending ? "Joining…" : "Join"}
        </Button>
      </form>
      {error && (
        <p id={`${id}-error`} role="alert" className={cn("mt-3 text-sm", s.error)}>
          {error}
        </p>
      )}
    </>
  );
}
