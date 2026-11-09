import type { Metadata } from "next";
import Image from "next/image";
import { ExploreBanner } from "@/components/explore/explore-banner";
import { ExploreNext } from "@/components/explore/explore-next";
import { GarmentIndex, type GarmentLine } from "@/components/explore/garment-index";
import { ExploreBoard, GalleryHeading } from "@/components/explore/explore-gallery";
import { Shot } from "@/components/explore/shot";
import { bannerPool, garment, street } from "@/lib/explore";

export const metadata: Metadata = {
  title: "Garment — CLVRY",
  description:
    "Cloth carried from the hill. Tees, denim, truckers, knits and polos from CLVRY: the first drop is in the works.",
};

// Design: CLVRY's own pieces, from the product mockups. Names are working titles.
const design = [
  { name: "Christ Above All Raglan", image: garment["christ-above-all-raglan"] },
  { name: "Script Polo — Olive", image: garment["polo-olive"] },
  { name: "Saved by the Cross Trucker — Burgundy", image: garment["cross-trucker-burgundy"] },
  { name: "Crucifix Knit Vest", image: garment["crucifix-vest"] },
  { name: "Jesus Saves Wide Denim", image: garment["wide-denim"] },
  { name: "Only Jesus Saves Tee — Charcoal", image: garment["only-jesus-saves-charcoal"] },
  { name: "Follow Christ Tee", image: garment["follow-christ"] },
  { name: "Tree of Life Tee — Bone", image: garment["tree-tee-bone"] },
  { name: "Script Polo — Navy", image: garment["polo-navy"] },
  { name: "Saved by the Cross Trucker — Black", image: garment["cross-trucker-black"] },
  { name: "Jesus Saves Jorts", image: garment.jorts },
  { name: "Only Jesus Saves Tee — Rose", image: garment["only-jesus-saves-rose"] },
  { name: "Blood of Jesus Tee", image: garment["blood-of-jesus"] },
  { name: "Tree of Life Tee — Black", image: garment["tree-tee-black"] },
  { name: "Gold-Piped Tee — Navy", image: garment["piped-tee-navy"] },
  { name: "Call on Jesus Ringer", image: garment["call-on-jesus"] },
  { name: "Focus on Jesus Ringer", image: garment["focus-on-jesus"] },
  { name: "Crew Socks", image: garment["crew-socks"] },
  { name: "CLVRY Wrld Corduroy Caps", image: garment["clvry-caps"] },
  { name: "Crown of Thorns Beanie", image: garment["thorn-beanies"] },
];

// Garments: plain cloth only, no graphics. Each family leads with an image that crops well to the
// 4:5 preview.
const lines: GarmentLine[] = [
  {
    n: "01",
    name: "Tees",
    note: "Heavyweight blanks in wine, clay, moss and bone.",
    images: [garment.crewnecks, garment.heavyweights, garment.sleeveless, garment["colour-rail"]],
  },
  {
    n: "02",
    name: "Denim",
    note: "Raw hems in every wash, made to be broken in.",
    images: [garment["raw-hems"], garment["denim-wall"], garment["rolled-denim"]],
  },
  {
    n: "03",
    name: "Layers",
    note: "Overshirts and outer layers for the in-between seasons.",
    images: [garment.overshirts, garment["faith-jacket"], garment["coming-soon"]],
  },
];

// Where the cloth goes: the city, plus the graphic pieces from other makers that move us.
const outside = [
  ...Object.values(street),
  garment["the-way-car"],
  garment["darkness-light"],
  garment["the-way-cap"],
  garment["together-in-faith"],
];

export default function GarmentPage() {
  return (
    <>
      <ExploreBanner
        index="02"
        name="Garment"
        line="Cloth carried from the hill. Cut plain, printed with the Word."
        images={bannerPool(garment, street)}
      />

      {/* The atelier */}
      <section className="px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-6xl items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-gold" />
              </span>
              The atelier — first drop in the works
            </p>
            <h2 className="reveal mt-6 font-display text-4xl uppercase leading-[1.05] md:text-7xl">
              Plain.
              <br />
              Heavy.
              <br />
              <span className="text-gold">Honest.</span>
            </h2>
            <p className="reveal mt-8 max-w-lg leading-relaxed text-muted-foreground">
              Heavyweight tees, honest denim, caps and knits, cut plain, finished slow, and printed with the
              Word where it counts. Nothing loud for the sake of it. The first pieces are on the table now.
            </p>
          </div>
          <Shot
            image={garment.heavyweights}
            crop="aspect-square"
            caption="Swatch — wine, clay, moss, bone"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="md:col-span-5"
          />
        </div>
      </section>

      {/* Design: CLVRY's own pieces as a swipeable rail. Each sits on a paper ground (multiply melts
          the mockups' white backdrops into it, so every card reads as one set). */}
      <section className="border-t border-border py-20 md:py-32">
        <div className="px-5 md:px-12">
          <GalleryHeading
            eyebrow="CLVRY Studios"
            title="Design"
            note="Our own pieces, in development now. Swipe through. Names, colours and details may change before release."
          />
        </div>
        <ol className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mt-16 md:gap-6 md:px-12">
          {design.map((piece, i) => (
            <li key={piece.image.src} className="group w-[72vw] shrink-0 snap-start md:w-[26vw]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ece7dd]">
                <Image
                  src={piece.image.src}
                  alt={piece.image.alt}
                  fill
                  sizes="(min-width: 768px) 26vw, 72vw"
                  className="object-contain p-3 mix-blend-multiply transition duration-700 ease-out group-hover:scale-[1.04] md:p-5"
                />
                <span className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.25em] text-night/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <p className="font-display text-xs uppercase tracking-[0.12em] md:text-sm">{piece.name}</p>
                <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-gold">Coming soon</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Garments: the plain cloth, no graphics */}
      <section className="border-t border-border px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— The cloth</p>
          <h2 className="mt-4 mb-12 font-display text-3xl uppercase md:mb-16 md:text-5xl">Garments</h2>
          <GarmentIndex lines={lines} />
        </div>
      </section>

      {/* Out in the street */}
      <section className="border-t border-border px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <GalleryHeading
            eyebrow="Out in the street"
            title="Where the cloth goes"
            note="Crossings, billboards, back roads, and the pieces that move us. The Word was always meant to be worn outside."
          />
          <ExploreBoard images={outside} label="Street" className="mt-12 md:mt-16" />
        </div>
      </section>

      <ExploreNext current="garment" />
    </>
  );
}
