"use client";

import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AdminButton, Field, TextInput } from "./ui";

export function LoginForm() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Couldn't sign in.");
      // Only follow relative admin paths, never an outside URL.
      const next = params.get("next");
      window.location.assign(next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
    } catch (err) {
      setError((err as Error).message);
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 flex flex-col gap-5">
      <Field label="Username">
        <TextInput name="username" autoComplete="username" required autoFocus />
      </Field>
      <Field label="Password">
        <TextInput name="password" type="password" autoComplete="current-password" required />
      </Field>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <AdminButton type="submit" disabled={pending} className="mt-2 h-11">
        {pending && <Loader2Icon className="animate-spin" aria-hidden />}
        Sign in
      </AdminButton>
    </form>
  );
}
