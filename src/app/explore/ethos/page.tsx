import type { Metadata } from "next";
import { ExploreBanner } from "@/components/explore/explore-banner";
import { ExploreNext } from "@/components/explore/explore-next";
import { ExploreBoard, ExploreRail, GalleryHeading } from "@/components/explore/explore-gallery";
import { Shot } from "@/components/explore/shot";
import { bannerPool, cathedrals, ethos, paintings, type ExploreImage } from "@/lib/explore";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ethos — CLVRY",
  description:
    "We believe in Jesus Christ, the Son of the living God. Christ above all, saved by grace: the ethos behind CLVRY.",
};

// The ethos as written by the founders; the creed itself opens the page.
const pillars = [
  {
    n: "I",
    title: "The Cross",
    body: "We believe in the Cross as the ultimate expression of God's love, the price of our redemption and the foundation of our faith.",
    image: ethos["carrying-the-cross"],
  },
  {
    n: "II",
    title: "Grace",
    body: "We believe that grace is given, faith is lived, and salvation is found in Christ alone.",
    image: ethos["praying-hands"],
  },
  {
    n: "III",
    title: "The gift",
    body: "Creativity is a gift, and excellence is a responsibility.",
    image: ethos["crown-of-thorns"],
  },
];

const mottos = [
  { line: "Christ above all", latin: "Soli Deo Gloria", meaning: "Glory to God alone" },
  { line: "Saved by grace", latin: "Solus Christus", meaning: "Christ alone" },
];

// Shown in the creed, pillars and mottos; everything else in Ethos goes on the board.
const featured = new Set<ExploreImage>([
  ethos.sanctuary,
  ethos.communion,
  ethos["glass-cross"],
  ethos["red-crucifix"],
  ...pillars.map((p) => p.image),
]);
const board = Object.values(ethos).filter((img) => !featured.has(img));

export default function EthosPage() {
  return (
    <>
      <ExploreBanner
        index="01"
        name="Ethos"
        line="Before the cloth, the cross. What we believe, and why we make anything at all."
        images={bannerPool(ethos, cathedrals, paintings)}
      />

      {/* The creed */}
      <section className="px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— The creed</p>
          <div>
            <p className="reveal font-display text-2xl leading-snug md:text-4xl md:leading-snug">
              We believe in <span className="text-gold">Jesus Christ</span>, the Son of the living God.
            </p>
            <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              He came, lived, suffered, died and rose again, that through Him we might receive salvation,
              redemption and eternal life.
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
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— What we believe</p>
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

      <ExploreRail
        eyebrow="Sanctuaries"
        title="Rooms built for glory"
        note="Gothic naves, painted domes, concrete and light. Where the street learned to look up."
        images={Object.values(cathedrals)}
        label="Sanctuary"
      />

      {/* The mottos */}
      <section className="grid bg-wine text-paper md:grid-cols-2">
        <Shot image={ethos["red-crucifix"]} crop="aspect-[4/5] md:aspect-auto md:h-full" className="md:h-full" />
        <div className="reveal flex flex-col justify-center px-5 py-16 md:px-16 md:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-goldenrod">— What we stand on</p>
          <ul className="mt-10 flex flex-col gap-10">
            {mottos.map((m) => (
              <li key={m.latin} className="border-t border-paper/20 pt-8">
                <p className="font-display text-4xl uppercase leading-tight md:text-6xl">{m.line}</p>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.3em]">
                  <span lang="la" className="text-goldenrod">
                    {m.latin}
                  </span>
                  <span className="text-paper/60">{m.meaning}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ExploreRail
        eyebrow="The masters"
        title="Told in oil and glass"
        note="Centuries of hands painting the same story. We're only picking up where they left off."
        images={Object.values(paintings)}
        label="Plate"
        className="border-t-0"
      />

      {/* The reference board */}
      <section className="border-t border-border px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <GalleryHeading
            eyebrow="The board"
            title="What we look at when we make"
            note="Old masters and street signs, engravings and neon. The same story, told in every material."
          />
          <ExploreBoard images={board} className="mt-12 md:mt-16" />
        </div>
      </section>

      <ExploreNext current="ethos" />
    </>
  );
}
