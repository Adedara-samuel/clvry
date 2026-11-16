import content from "@/content/site.json";
import type { SiteContent } from "@/lib/content-schema";

// Scripture quotations are from the New King James Version®. Copyright © 1982 by Thomas Nelson.
// Used by permission. All rights reserved.
// The verses live in src/content/site.json and are edited at /admin/content.
const verses = (content as SiteContent).ticker;

export function ScriptureTicker() {
  return (
    <div className="overflow-hidden bg-wine py-2 text-paper">
      {/* Screen readers get the verses once; the moving copy is decorative. */}
      <ul className="sr-only">
        {verses.map((v, i) => (
          <li key={i}>
            {v.text} {v.ref} (NKJV)
          </li>
        ))}
      </ul>
      {/* Two identical halves so the -50% translate loops seamlessly. */}
      <div aria-hidden className="animate-ticker flex w-max whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em]">
        {[0, 1].map((half) => (
          <div key={half} className="flex">
            {verses.map((v, i) => (
              <span key={i} className="flex items-center gap-3 pr-12">
                <span className="text-paper/90">&ldquo;{v.text}&rdquo;</span>
                <span className="text-goldenrod">
                  {v.ref} <span className="text-paper/50">NKJV</span>
                </span>
                <span className="pl-9 text-paper/30">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
