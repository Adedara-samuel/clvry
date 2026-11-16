"use client";

import {
  ExternalLinkIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  PanelsTopLeftIcon,
  ShirtIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CrossMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";
import { api } from "./api";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/subscribers", label: "Subscribers", icon: UsersIcon },
  { href: "/admin/campaigns", label: "Campaigns", icon: MailIcon },
  { href: "/admin/content", label: "Site content", icon: PanelsTopLeftIcon },
  { href: "/admin/gallery", label: "Gallery", icon: ImagesIcon },
  { href: "/admin/products", label: "Products", icon: ShirtIcon },
];

async function signOut() {
  await api("/api/admin/logout", { method: "POST", body: {} }).catch(() => {});
  // A full page load on purpose: it drops every cached admin query along with the session.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/admin/login");
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground md:flex-row">
      <aside className="border-b border-border md:sticky md:top-0 md:flex md:h-svh md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0">
        <div className="flex items-center justify-between gap-3 px-5 py-4 md:py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <CrossMark className="w-7 text-gold" />
            <span>
              <span className="block font-display text-sm uppercase tracking-[0.2em]">CLVRY</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Admin</span>
            </span>
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav aria-label="Admin" className="overflow-x-auto md:flex-1 md:overflow-visible">
          <ul className="flex gap-1 px-3 pb-3 md:flex-col md:px-3 md:pb-0">
            {nav.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active(href) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 whitespace-nowrap px-3 py-2 text-sm transition-colors",
                    active(href)
                      ? "bg-muted text-foreground shadow-[inset_2px_0_0_var(--color-gold)]"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden flex-col gap-1 border-t border-border p-3 md:flex">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <ExternalLinkIcon className="size-4" aria-hidden />
            View site
          </a>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <LogOutIcon className="size-4" aria-hidden />
            Sign out
          </button>
          <div className="px-1 pt-2">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
        <div className="mt-12 flex gap-6 border-t border-border pt-4 md:hidden">
          <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            View site
          </Link>
          <button type="button" onClick={signOut} className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
