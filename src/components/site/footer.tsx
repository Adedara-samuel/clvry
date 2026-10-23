import { Wordmark } from "@/components/brand/logo";

const columns = [
  { title: "Shop", links: ["Drop 001", "Hoodies", "Tees", "Headwear"] },
  { title: "Sound", links: ["Circle Sessions", "Vol. 01", "Spotify", "Apple Music"] },
  { title: "Follow", links: ["Instagram", "TikTok", "YouTube"] },
];

export function Footer() {
  return (
    <footer className="mt-auto px-5 pt-20 pb-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <p className="col-span-2 max-w-xs text-sm leading-relaxed text-bone/60 md:col-span-1">
            Streetwear carried from the cross. Made plain, made to last.
          </p>
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{c.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-bone/70">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-bone">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Wordmark className="mt-20 w-full text-bone/90" label="CLVRY" />

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-bone/10 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/40 sm:flex-row">
          <span>© CLVRY. All glory to God.</span>
          <span>Galatians 6:14</span>
        </div>
      </div>
    </footer>
  );
}
