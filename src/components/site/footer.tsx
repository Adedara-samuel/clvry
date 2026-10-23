import { Wordmark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const columns = [
  { title: "Shop", items: ["Drop 001", "Hoodies", "Tees", "Headwear"] },
  { title: "Sound", items: ["Circle Sessions", "Vol. 01", "Streaming"] },
  { title: "Follow", items: ["Instagram", "TikTok", "YouTube"] },
];

export function Footer() {
  return (
    <footer className="mt-auto px-5 pt-20 pb-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <p className="col-span-2 max-w-xs text-sm leading-relaxed text-muted-foreground md:col-span-1">
            Streetwear carried from the cross. Made plain, made to last.
          </p>
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
                {c.title}
                <Badge variant="outline" className="text-[8px] tracking-[0.2em] text-muted-foreground">
                  Soon
                </Badge>
              </h3>
              {/* Not links yet: none of these destinations exist. */}
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground/70">
                {c.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Wordmark className="mt-20 w-full text-foreground/90" label="CLVRY" />

        <Separator className="mt-8" />
        <div className="flex flex-col justify-between gap-2 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:flex-row">
          <span>© CLVRY. All glory to God.</span>
          <span>Galatians 6:14</span>
          <span>
            Developed by{" "}
            <a
              href="https://sapoktech.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 transition hover:underline"
            >
              Sapok
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
