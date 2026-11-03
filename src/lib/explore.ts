/*
 * The Explore pages (/explore/ethos, /garment, /events). Images live in public/explore/<section>/,
 * pre-sized to 1400px WebP; width/height are the files' intrinsic size so next/image can reserve space.
 */

export type ExploreImage = { src: string; width: number; height: number; alt: string };

function shots<T extends Record<string, [number, number, string]>>(section: string, list: T) {
  return Object.fromEntries(
    Object.entries(list).map(([slug, [width, height, alt]]) => [
      slug,
      { src: `/explore/${section}/${slug}.webp`, width, height, alt },
    ]),
  ) as { [K in keyof T]: ExploreImage };
}

export const ethos = shots("ethos", {
  sanctuary: [736, 827, "A lone figure walking the aisle of a white chapel toward the cross"],
  "jesus-saves": [736, 742, "A 'Jesus Saves' cross sign over a city block"],
  "three-angels": [640, 640, "Engraving of three angels bearing shields marked with the cross"],
  "glass-cross": [736, 915, "A stained-glass cross with Christ in glory"],
  "hill-crucifix": [736, 1104, "Oil painting of the crucifixion on a hill"],
  "carrying-the-cross": [600, 888, "Christ, crowned with thorns, carrying the cross"],
  "crown-of-thorns": [600, 600, "A crown of thorns embroidered on linen"],
  seal: [736, 736, "Engraved seal of the Lamb, the dove and the hand of blessing"],
  communion: [736, 1104, "Christ lifting the bread at the Last Supper by candlelight"],
  "jesus-is-king": [736, 795, "A 'Jesus is King' flag raised over the city"],
  "holy-bible": [736, 977, "A Holy Bible resting on linen"],
  rosary: [736, 981, "A gold crucifix laid on an open Bible"],
  "sin-no-more": [1125, 1125, "Christ before a crowd beneath the words 'Go and sin no more'"],
  "red-crucifix": [736, 1104, "A crucifix silhouetted against deep red"],
  heaven: [1400, 1168, "A street sign reading 'Heaven' against the night sky"],
  "jesus-is-alive": [788, 1400, "A poster reading 'Jesus is Alive'"],
  "last-supper": [735, 490, "Painting of the Last Supper"],
  crucifixion: [735, 1048, "Léon Bonnat, The Crucifixion (1874)"],
  "screen-cross": [736, 981, "A cross built from screens showing the Passion"],
});

export const garment = shots("garment", {
  heavyweights: [736, 736, "Heavyweight tees folded in wine, clay, green and cream"],
  "falling-tees": [736, 1103, "Tees cascading from a box onto a gallery floor"],
  "colour-rail": [736, 1307, "A rail of tees in graded colour"],
  crewnecks: [736, 920, "Crewneck collars in rust, clay and cream"],
  "raw-hems": [736, 966, "Stacked denim with raw, frayed hems"],
  "coming-soon": [736, 1308, "An almost empty rail beneath the words 'coming soon'"],
  "clvry-caps": [1400, 933, "Black corduroy CLVRY caps: 'Jesus Saves' and 'Christ Above All'"],
  "darkness-light": [1105, 1400, "A cream tee printed 'His love saved us from darkness and brought us into light'"],
  overshirts: [736, 1309, "Overshirts hanging in sage, black and tan"],
  "denim-wall": [736, 1104, "A wall of folded denim in every wash"],
  sleeveless: [736, 920, "Sleeveless tops hanging on a wire"],
  "thorn-beanies": [1400, 933, "Reversible crown-of-thorns beanies"],
  "rolled-denim": [736, 1308, "Rolled denim seen from above"],
  "the-way-cap": [736, 981, "A cap embroidered 'Jesus: the way, the truth, the life'"],
});

export const events = shots("events", {
  "speaker-cross": [676, 549, "Kneeling in prayer beneath a cross built from speakers"],
  "the-booth": [473, 701, "Hands raised around a DJ booth"],
  "gallery-night": [736, 981, "A gallery night in a raw concrete space"],
  "tee-field": [736, 920, "Tees laid across a concrete plaza as an installation"],
  "at-the-decks": [736, 736, "Christ at the decks before a crowd"],
  "jesus-raves": [736, 1041, "A poster reading 'Jesus Raves'"],
  "vision-board": [736, 1308, "A vision-board night: magazines and collage across the floor"],
});

/** Nav order: Ethos first — what we believe comes before what we wear. */
export const exploreSections = [
  { slug: "ethos", href: "/explore/ethos", index: "01", name: "Ethos" },
  { slug: "garment", href: "/explore/garment", index: "02", name: "Garment" },
  { slug: "events", href: "/explore/events", index: "03", name: "Events" },
] as const;

export type ExploreSlug = (typeof exploreSections)[number]["slug"];
