"use client";

import { Loader2Icon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Small building blocks shared by the admin pages, in the site's brand language. */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-2xl uppercase tracking-[0.06em] md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-border bg-card/40", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            {title && <h2 className="font-mono text-[11px] uppercase tracking-[0.25em]">{title}</h2>}
            {description && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="text-xs leading-relaxed text-muted-foreground">{hint}</span>}
    </label>
  );
}

const control =
  "w-full min-w-0 border border-input bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50 aria-invalid:border-destructive";

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-9", className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-24 py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(control, "h-9 bg-background", className)} {...props} />;
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center border transition-colors",
        checked ? "border-primary bg-primary" : "border-input bg-transparent",
      )}
    >
      <span
        className={cn(
          "block size-3.5 transition-transform",
          checked ? "translate-x-[18px] bg-primary-foreground" : "translate-x-[2px] bg-muted-foreground",
        )}
      />
    </button>
  );
}

export function Stat({ label, value, note }: { label: string; value: ReactNode; note?: ReactNode }) {
  return (
    <div className="border border-border bg-card/40 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-3xl">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <p className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
      <Loader2Icon className="size-4 animate-spin" aria-hidden />
      {label}
    </p>
  );
}

export function ErrorNote({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div role="alert" className="border border-destructive/40 bg-destructive/10 p-4 text-sm">
      <p className="font-medium text-destructive">Couldn&rsquo;t load this.</p>
      <p className="mt-1 text-muted-foreground">{error.message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] underline">
          Try again
        </button>
      )}
    </div>
  );
}

/** Sticky bar shown while a form has unsaved changes. */
export function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  if (!dirty && !saving) return null;
  return (
    <div className="sticky bottom-0 z-20 -mx-5 mt-8 flex items-center justify-between gap-4 border-t border-border bg-background/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10">
      <p className="text-sm text-muted-foreground">You have unsaved changes.</p>
      <div className="flex gap-2">
        <AdminButton variant="ghost" onClick={onDiscard} disabled={saving}>
          Discard
        </AdminButton>
        <AdminButton onClick={onSave} disabled={saving}>
          {saving && <Loader2Icon className="size-3.5 animate-spin" aria-hidden />}
          {saving ? "Saving…" : "Save changes"}
        </AdminButton>
      </div>
    </div>
  );
}

export function AdminButton({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "outline" | "ghost" | "danger" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 px-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5 [&_svg]:shrink-0",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/85",
        variant === "outline" && "border border-input hover:bg-muted",
        variant === "ghost" && "hover:bg-muted",
        variant === "danger" && "border border-destructive/40 text-destructive hover:bg-destructive/10",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "good" | "bad" | "gold"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em]",
        tone === "neutral" && "border-border text-muted-foreground",
        tone === "good" && "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
        tone === "bad" && "border-destructive/40 text-destructive",
        tone === "gold" && "border-gold/50 text-gold",
      )}
    >
      {children}
    </span>
  );
}

export function formatDate(iso: string, withTime = false) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  }).format(new Date(iso));
}

/** Lowercase-dash slug from any text. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
