"use client";

import { useState } from "react";
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
    subscribe.mutate(parsed.data, { onSuccess: () => setEmail("") });
  }

  const message = error ?? subscribe.error?.message;

  return (
    <section className="bg-wine px-5 py-24 text-center text-paper">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-goldenrod">The list</p>
      <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl uppercase md:text-4xl">
        First to the drop. First in the circle.
      </h2>

      {subscribe.isSuccess ? (
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-goldenrod">You&apos;re in. Grace and peace.</p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(message)}
            aria-describedby={message ? "email-error" : undefined}
            className="flex-1 border border-paper/30 bg-transparent px-4 py-3 text-sm placeholder:text-paper/50 focus:border-goldenrod focus:outline-none"
          />
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="bg-goldenrod px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-night transition hover:bg-paper disabled:opacity-60"
          >
            {subscribe.isPending ? "Joining…" : "Join"}
          </button>
        </form>
      )}
      {message && (
        <p id="email-error" role="alert" className="mt-3 text-sm text-paper">
          {message}
        </p>
      )}
    </section>
  );
}
