import { socials } from "@/lib/socials";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./social-icon";

/** Instagram + X links (@clvrywrld). */
export function Socials({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center justify-center gap-6", className)}>
      {socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`CLVRY on ${s.name} (${s.handle})`}
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition hover:text-gold"
          >
            <SocialIcon name={s.name} className="size-4" />
            <span>{s.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
