"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { HeartLogo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUi } from "@/store/ui";
import { ThemeToggle } from "./theme-toggle";

// Every section is still in the works, so nav points at the Coming Soon block.
const links = [
  { href: "#coming-soon", label: "Shop" },
  { href: "#coming-soon", label: "Circle Sessions" },
  { href: "#coming-soon", label: "Lookbook" },
];

export function Header() {
  const menuOpen = useUi((s) => s.menuOpen);
  const setMenuOpen = useUi((s) => s.setMenuOpen);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-5 md:px-8">
        <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.2em] md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="group text-muted-foreground transition hover:text-gold">
              {l.label}
              <sup className="ml-1 text-[8px] text-gold/70">soon</sup>
            </a>
          ))}
        </nav>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="justify-self-start md:hidden" aria-label="Open menu" />}
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left" className="bg-background">
            <SheetHeader className="p-6">
              <SheetTitle>
                <HeartLogo className="w-20 text-foreground" label="CLVRY" />
              </SheetTitle>
            </SheetHeader>
            <ul className="flex flex-col gap-6 px-6 font-display text-2xl uppercase">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 hover:text-gold">
                    {l.label}
                    <Badge variant="outline" className="font-mono text-[9px] tracking-[0.2em] text-gold">
                      Soon
                    </Badge>
                  </a>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>

        <Link href="/" aria-label="CLVRY home" className="justify-self-center">
          <HeartLogo className="w-20 text-foreground transition hover:text-gold md:w-24" label="CLVRY" />
        </Link>

        <div className="flex items-center gap-2 justify-self-end">
          <ThemeToggle />
          <a
            href="#notify"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden h-9 px-4 font-mono text-[10px] uppercase tracking-[0.25em] sm:inline-flex",
            )}
          >
            Notify me
          </a>
        </div>
      </div>
    </header>
  );
}
