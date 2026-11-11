import { AudioLinesIcon } from "lucide-react";
import { platforms, playlists, type Platform } from "@/lib/playlists";
import { cn } from "@/lib/utils";

// Brand glyphs inline: lucide no longer ships brand icons.
function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  if (platform === "Spotify") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    );
  }
  return <AudioLinesIcon className={className} strokeWidth={1.75} aria-hidden />;
}

const pill = "inline-flex items-center gap-2 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em]";

/** Playlists under Music: each opens on Spotify or Audiomack once its link is set in lib/playlists. */
export function Playlists({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Playlists</p>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
          Spotify · Audiomack
        </p>
      </div>
      <ul className="mt-4 border-t border-border">
        {playlists.map((p) => (
          <li key={p.title} className="flex flex-col gap-3 border-b border-border py-4">
            <div className="flex items-center gap-4">
              <span aria-hidden className="flex size-11 shrink-0 items-center justify-center bg-wine text-goldenrod">
                <AudioLinesIcon className="size-4" strokeWidth={1.5} />
              </span>
              <div className="flex-1">
                <p className="font-display text-sm uppercase tracking-[0.1em]">{p.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.note}</p>
              </div>
              {platforms.some((platform) => !p.links[platform]) && (
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-gold">Coming soon</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pl-15">
              {platforms.map((platform) => {
                const href = p.links[platform];
                return href ? (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Listen to ${p.title} on ${platform}`}
                    className={cn(pill, "border-border transition hover:border-gold hover:text-gold")}
                  >
                    <PlatformIcon platform={platform} className="size-3.5" />
                    {platform}
                  </a>
                ) : (
                  <span
                    key={platform}
                    aria-disabled="true"
                    title={`Coming soon on ${platform}`}
                    className={cn(pill, "border-dashed border-border text-muted-foreground")}
                  >
                    <PlatformIcon platform={platform} className="size-3.5 opacity-60" />
                    {platform}
                    <span className="sr-only">: coming soon</span>
                  </span>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
