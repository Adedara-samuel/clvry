const words = ["Bring Christ to the Street", "Coming Soon", "Drop 001", "Circle Sessions", "Galatians 6:14"];

export function Marquee() {
  // Content is doubled so the -50% translate loops seamlessly.
  const row = [...words, ...words];
  return (
    <div className="overflow-hidden border-y border-goldenrod/30 bg-wine py-3" aria-hidden>
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-display text-sm uppercase tracking-[0.3em] text-goldenrod">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            {w}
            <span className="text-paper/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
