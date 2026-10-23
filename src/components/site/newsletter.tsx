"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscribe } from "@/lib/queries";
import { subscribeSchema } from "@/lib/schemas";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const subscribe = useSubscribe();

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
        toast.success("You're on the list. Grace and peace.");
      },
      onError: (err) => toast.error(err.message),
    });
  }

  return (
    <section id="notify" className="scroll-mt-16 bg-wine px-5 py-24 text-center text-paper">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-goldenrod">The list</p>
      <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl uppercase md:text-4xl">
        First to the drop. First in the circle.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-paper/70">
        The shop, Circle Sessions and the lookbook are coming soon. Leave your email and we&apos;ll tell you
        the moment they open.
      </p>

      {subscribe.isSuccess ? (
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-goldenrod">You&apos;re in. Grace and peace.</p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
          <Label htmlFor="email" className="sr-only">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "email-error" : undefined}
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
      )}
      {error && (
        <p id="email-error" role="alert" className="mt-3 text-sm text-paper">
          {error}
        </p>
      )}
    </section>
  );
}
