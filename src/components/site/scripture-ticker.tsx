// Scripture quotations are from the New King James Version®. Copyright © 1982 by Thomas Nelson.
// Used by permission. All rights reserved.
const verses = [
  {
    ref: "Luke 23:32",
    text: "There were also two others, criminals, led with Him to be put to death.",
  },
  {
    ref: "Galatians 6:14",
    text: "But God forbid that I should boast except in the cross of our Lord Jesus Christ, by whom the world has been crucified to me, and I to the world.",
  },
  {
    ref: "Hebrews 12:2",
    text: "Looking unto Jesus, the author and finisher of our faith, who for the joy that was set before Him endured the cross, despising the shame, and has sat down at the right hand of the throne of God.",
  },
];

export function ScriptureTicker() {
  return (
    <div className="overflow-hidden bg-wine py-2 text-paper">
      {/* Screen readers get the verses once; the moving copy is decorative. */}
      <ul className="sr-only">
        {verses.map((v) => (
          <li key={v.ref}>
            {v.text} {v.ref} (NKJV)
          </li>
        ))}
      </ul>
      {/* Two identical halves so the -50% translate loops seamlessly. */}
      <div aria-hidden className="animate-ticker flex w-max whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em]">
        {[0, 1].map((half) => (
          <div key={half} className="flex">
            {verses.map((v) => (
              <span key={v.ref} className="flex items-center gap-3 pr-12">
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
