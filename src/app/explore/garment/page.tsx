import type { Metadata } from "next";
import { ExploreBanner } from "@/components/explore/explore-banner";
import { ExploreNext } from "@/components/explore/explore-next";
import { GarmentIndex, type GarmentLine } from "@/components/explore/garment-index";
import { ExploreBoard, ExploreRail, GalleryHeading } from "@/components/explore/explore-gallery";
import { Shot } from "@/components/explore/shot";
import { bannerPool, garment, street } from "@/lib/explore";

export const metadata: Metadata = {
  title: "Garment — CLVRY",
  description: "Cloth carried from the hill. Heavyweights, denim, headwear and layers from CLVRY: first drop in the works.",
};

const lines: GarmentLine[] = [
  {
    n: "01",
    name: "Heavyweights",
    note: "Tees and tanks in wine, clay, bone and black.",
    images: [garment.heavyweights, garment.crewnecks, garment["darkness-light"], garment.sleeveless],
  },
  {
    n: "02",
    name: "Denim",
    note: "Raw hems in every wash, made to be broken in.",
    images: [garment["raw-hems"], garment["denim-wall"], garment["rolled-denim"]],
  },
  {
    n: "03",
    name: "Headwear",
    note: "Corduroy caps and crown-of-thorns knits.",
    images: [garment["clvry-caps"], garment["thorn-beanies"], garment["the-way-cap"]],
  },
  {
    n: "04",
    name: "Layers",
    note: "Overshirts for the in-between seasons.",
    images: [garment.overshirts, garment["colour-rail"]],
  },
];

// Lookbook rail. It ends on the empty rail: the rest is still to come.
const looks = [
  garment["falling-tees"],
  garment["faith-jacket"],
  garment.crewnecks,
  garment["darkness-light"],
  garment["together-in-faith"],
  garment["denim-wall"],
  garment["barcode-poster"],
  garment.overshirts,
  garment["rodeo-cross"],
  garment["the-way-cap"],
  garment["coming-soon"],
];

// Where the cloth goes: the city, plus the two car pieces from the garment board.
const outside = [...Object.values(street), garment["yellow-car"], garment["the-way-car"]];

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

      {/* The line */}
      <section className="border-t border-border px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">— The line</p>
          <h2 className="mt-4 mb-12 font-display text-3xl uppercase md:mb-16 md:text-5xl">Four families of cloth</h2>
          <GarmentIndex lines={lines} />
        </div>
      </section>

      <ExploreRail
        eyebrow="Lookbook"
        title="Vol. 00"
        note="Swipe through. The last frame is an empty rail. The rest is still to come."
        images={looks}
        label="Look"
      />

      {/* Out in the street */}
      <section className="border-t border-border px-5 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <GalleryHeading
            eyebrow="Out in the street"
            title="Where the cloth goes"
            note="Crossings, billboards and back roads. The Word was always meant to be worn outside."
          />
          <ExploreBoard images={outside} label="Street" className="mt-12 md:mt-16" />
        </div>
      </section>

      <ExploreNext current="garment" />
    </>
  );
}
