import type { Metadata } from "next";
import { ExploreBanner } from "@/components/explore/explore-banner";
import { ExploreNext } from "@/components/explore/explore-next";
import { Shot } from "@/components/explore/shot";
import { ethos } from "@/lib/explore";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ethos — CLVRY",
  description: "Before the cloth, the cross. What CLVRY believes, and why we make anything at all.",
};

const pillars = [
  {
    n: "I",
    title: "Christ above all",
    body: "Not a slogan on a tag: the order of everything we make. He comes first, and the cloth follows.",
    image: ethos["carrying-the-cross"],
  },
  {
    n: "II",
    title: "Quiet over loud",
    body: "Heavy cloth, plain cuts, few words. We would rather the Word did the talking.",
    image: ethos["holy-bible"],
  },
  {
    n: "III",
    title: "Sanctuary and street",
    body: "Faith was never meant to stay indoors. We carry it to the block, the studio and the dance floor.",
    image: ethos["jesus-saves"],
  },
  {
    n: "IV",
    title: "Made to be lived in",
    body: "Clothes for every day, not for the shelf. Worn in and softened, like a well-read Bible.",
    image: ethos["crown-of-thorns"],
  },
];

// The reference board: everything we look at when we make.
const board = [
  ethos["three-angels"],
  ethos.heaven,
  ethos["hill-crucifix"],
  ethos.seal,
  ethos["jesus-is-king"],
  ethos.rosary,
  ethos["screen-cross"],
  ethos["jesus-is-alive"],
  ethos["last-supper"],
  ethos.crucifixion,
  ethos["sin-no-more"],
];

export default function EthosPage() {
  return (
    <>
      <ExploreBanner
        index="01"
        name="Ethos"
        line="Before the cloth, the cross. What we believe, and why we make anything at all."
        images={Object.values(ethos)}
      />

      {/* The creed */}
      <section className="px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— The creed</p>
          <div>
            <p className="reveal font-display text-2xl leading-snug md:text-4xl md:leading-snug">
              We didn&apos;t make clothes and then go looking for a meaning.{" "}
              <span className="text-gold">The meaning came first</span>, on a hill called Calvary.
            </p>
            <p className="reveal mt-8 max-w-xl leading-relaxed text-muted-foreground">
              CLVRY is a Christian creative and lifestyle house: garments, sound and gatherings, carried from
              the cross into ordinary streets. Everything we cut, print and play starts there, and points back
              there.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 md:mt-24 md:grid-cols-3 md:gap-5">
          <Shot image={ethos.sanctuary} crop="aspect-[4/5]" caption="Fig. I — The aisle" sizes="(min-width: 768px) 33vw, 50vw" />
          <Shot
            image={ethos.communion}
            crop="aspect-[4/5]"
            caption="Fig. II — The table"
            sizes="(min-width: 768px) 33vw, 50vw"
            className="md:translate-y-16"
          />
          <Shot
            image={ethos["glass-cross"]}
            crop="aspect-[4/5]"
            caption="Fig. III — The glass"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="col-span-2 md:col-span-1"
          />
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-border px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— What we hold to</p>
          <ol className="mt-12 flex flex-col gap-20 md:mt-20 md:gap-32">
            {pillars.map((p, i) => (
              <li key={p.n} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
                <div className={cn("reveal md:col-span-6", i % 2 ? "md:order-2 md:col-start-7" : "md:col-start-1")}>
                  <span className="font-display text-6xl text-gold/70 md:text-8xl">{p.n}</span>
                  <h3 className="mt-4 font-display text-3xl uppercase tracking-[0.06em] md:text-5xl">{p.title}</h3>
                  <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
                <Shot
                  image={p.image}
                  crop="aspect-[4/5]"
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className={cn("md:col-span-5", i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-8")}
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Scripture */}
      <section className="grid bg-wine text-paper md:grid-cols-2">
        <Shot image={ethos["red-crucifix"]} crop="aspect-[4/5] md:aspect-auto md:h-full" className="md:h-full" />
        <blockquote className="reveal flex flex-col justify-center gap-8 px-5 py-16 md:px-16 md:py-24">
          <span aria-hidden className="font-display text-7xl leading-none text-goldenrod/60">“</span>
          <p className="font-display text-3xl leading-tight uppercase md:text-5xl">
            Neither do I condemn you; go and sin no more.
          </p>
          <cite className="font-mono text-[11px] not-italic uppercase tracking-[0.3em] text-goldenrod">
            John 8:11 <span className="text-paper/50">NKJV</span>
          </cite>
        </blockquote>
      </section>

      {/* The reference board */}
      <section className="px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— The board</p>
              <h2 className="mt-4 font-display text-3xl uppercase md:text-5xl">What we look at when we make</h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Old masters and street signs, engravings and flags. The same story, told in every material.
            </p>
          </div>
          <div className="mt-12 columns-2 gap-3 md:mt-16 md:columns-3 md:gap-5">
            {board.map((image, i) => (
              <Shot
                key={image.src}
                image={image}
                caption={`Fig. ${String(i + 4).padStart(2, "0")}`}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="mb-6 break-inside-avoid md:mb-8"
              />
            ))}
          </div>
        </div>
      </section>

      <ExploreNext current="ethos" />
    </>
  );
}
