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
  "stat-crux-engraving": [318, 347, "Engraved orb and cross: 'Stat crux dum volvitur orbis'"],
  "open-hand": [736, 736, "Christ reaching out an open hand, drawn in ink"],
  trumpets: [676, 1200, "Gilded angels with trumpets atop columns against blue sky"],
  "bible-and-rosary": [736, 981, "A black Holy Bible with a rosary across it"],
  "x-ray": [735, 936, "An X-ray of a ribcage with a cross over the heart"],
  pomegranate: [736, 966, "A silver crucifix above a split pomegranate"],
  crusader: [652, 960, "Godfrey de Bouillon on horseback beneath the Jerusalem cross"],
  sketch: [640, 640, "A grainy sketch of Christ, head in hand"],
  "stone-cross": [992, 1332, "A cross carved into weathered stone"],
  "the-storm": [736, 1104, "A boat in a storm, seen from above"],
  "stat-crux": [736, 736, "Gold seal: 'Stat crux dum volvitur orbis'"],
  "praying-hands": [736, 1308, "Hands folded in prayer around a rosary"],
  starlight: [638, 900, "Christ drawn in starlight"],
  "rear-view": [1127, 1400, "A rosary hanging from a rear-view mirror"],
  cherubs: [933, 1400, "Cherubs holding a rosary, drawn in silver"],
  redeemer: [736, 975, "Christ the Redeemer against a full moon"],
  "neon-crucifix": [1170, 1395, "A crucifix in neon pink and blue: 'Not my will, but Thine be done'"],
  "knight-angel": [928, 1232, "An armoured angel holding a cross of light"],
  aqueduct: [1055, 1400, "An aqueduct running through clouds and forest"],
  drowning: [1151, 1150, "Icon of Christ reaching Peter on the waves"],
  "heaven-colonnade": [785, 1400, "A marble colonnade among the clouds"],
  "hand-of-light": [632, 1400, "An open hand beneath a small cross of light"],
  "it-is-written": [736, 1096, "Luke 1:37 highlighted: 'For with God nothing shall be impossible'"],
  "on-the-water": [736, 1104, "Christ walking on water, drawn in blue"],
  "the-procession": [900, 900, "Illustration of a procession toward the cross"],
  "the-lake": [900, 621, "Illustration of Christ above a moonlit lake"],
  "three-crosses": [900, 720, "Illustration of three crosses on a hill"],
  "holy-holy-holy": [736, 1308, "A seraph crest: 'Holy, holy, holy'"],
  "john-3-16": [736, 1308, "A crucifix above the earth: John 3:16"],
  colonnade: [736, 1308, "A long arched colonnade"],
});

export const cathedrals = shots("cathedrals", {
  "bell-tower": [736, 981, "A baroque bell tower in black and white"],
  "a-frame": [736, 1035, "A modernist A-frame church crowned with a tall cross"],
  "gilded-dome": [676, 1200, "Gilded arches and a chandelier beneath a painted dome"],
  "gothic-nave": [682, 1024, "The long Gothic nave of a cathedral"],
  "painted-cupola": [736, 1308, "A painted cupola seen from directly below"],
  "notre-dame-altar": [736, 981, "The altar of Notre-Dame de Paris beneath a gold cross"],
  "light-in-the-pews": [736, 1253, "Light falling through stained glass across the pews"],
  iconostasis: [736, 981, "A carved Orthodox iconostasis"],
  "white-sanctuary": [712, 1400, "A white modern sanctuary ribbed with stained glass"],
  "ecce-homo": [736, 736, "The Cathedral of Santo Ecce Homo, Valledupar, lit at dusk"],
});

export const paintings = shots("paintings", {
  "hand-and-crucifix": [736, 730, "Detail of a painted hand holding a gold crucifix"],
  "crown-detail": [719, 719, "Detail of Christ's eyes beneath the crown of thorns"],
  creation: [736, 736, "The Creation of Adam, rendered in gold leaf"],
  risen: [663, 830, "The risen Christ among the saints"],
  "ascension-glass": [651, 1400, "The Ascension in stained glass"],
  golgotha: [736, 872, "Golgotha at night, the crowd gathered beneath the crosses"],
  ascension: [675, 1200, "Christ ascending through the clouds"],
  "rosary-hands": [675, 1200, "A rosary falling from one hand to another"],
  "ecce-homo-ciseri": [736, 920, "Antonio Ciseri, Ecce Homo (c. 1871)"],
  daniel: [735, 919, "Briton Rivière, Daniel in the Lions' Den"],
  "the-bread": [592, 800, "Christ raising the bread at the Last Supper"],
  "last-sigh": [735, 584, "Julien-Michel Gué, The Last Sigh of Christ"],
  "last-supper-panorama": [1400, 661, "The Last Supper"],
  ceiling: [736, 1104, "A painted church ceiling, sky opening at its centre"],
});

export const street = shots("street", {
  "trust-god-bro": [736, 897, "A Times Square billboard reading 'Trust God Bro'"],
  "jesus-is-king-billboard": [640, 853, "A 'Jesus is King' billboard over a city street"],
  "blue-towers": [736, 981, "Towers in blue over a busy avenue"],
  "from-above": [735, 1103, "A city street seen from above"],
  "paris-crossing": [736, 981, "A Paris crossing beside a stone facade"],
  "regent-street": [736, 1104, "Regent Street, London, under cloud"],
  "wet-crossing": [675, 1200, "A wet zebra crossing between stone buildings"],
  "jesus-saves-wall": [389, 600, "A 'Jesus Saves' cross on a city wall, a mother and child passing"],
  ezra: [735, 919, "A Times Square billboard: 'Be of good courage, and do it' (Ezra 10:4)"],
  corner: [736, 981, "A quiet city corner at a crossing"],
  "one-way": [736, 1104, "A 'One Way' sign beside a lit cross at night"],
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
  "faith-jacket": [735, 936, "Washed leather jacket, crucifix and a 'Faith' chain belt"],
  "rodeo-cross": [736, 1308, "Graphic: a rider and cross in blue"],
  "the-way-car": [736, 1041, "A purple car under the words 'Jesus is the way'"],
  "together-in-faith": [736, 920, "Graphic: 'Together in Faith'"],
  "barcode-poster": [736, 1308, "A halftone poster of Christ with a barcode"],
  "yellow-car": [736, 1104, "A couple beside a yellow car in an open field"],
});

export const events = shots("events", {
  "speaker-cross": [676, 549, "Kneeling in prayer beneath a cross built from speakers"],
  "the-booth": [473, 701, "Hands raised around a DJ booth"],
  "gallery-night": [736, 981, "A gallery night in a raw concrete space"],
  "tee-field": [736, 920, "Tees laid across a concrete plaza as an installation"],
  "at-the-decks": [736, 736, "Christ at the decks before a crowd"],
  "jesus-raves": [736, 1041, "A poster reading 'Jesus Raves'"],
  "vision-board": [736, 1308, "A vision-board night: magazines and collage across the floor"],
  "red-room": [236, 295, "A white gallery hung with bold red canvases"],
  "crowd-of-light": [736, 1104, "A crowd beneath columns of coloured light and a cross"],
  "hands-up": [736, 981, "Hands raised to a lit cross at a concert"],
  "dj-hands": [736, 1265, "Hands on the decks over a city skyline"],
  "red-cathedral": [736, 920, "A rave in a cathedral washed in red"],
  "heals-the-broken": [736, 981, "A placard in a crowd: 'Jesus heals the broken'"],
});

/** Banner frames run ~25vw wide, so leave out the few images too small to fill one cleanly. */
export function bannerPool(...groups: Record<string, ExploreImage>[]) {
  return groups.flatMap((g) => Object.values(g)).filter((img) => img.width >= 600);
}

/** Nav order: Ethos first — what we believe comes before what we wear. */
// `cover` and `tagline` fill the nav's hover preview card.
export const exploreSections = [
  {
    slug: "ethos",
    href: "/explore/ethos",
    index: "01",
    name: "Ethos",
    tagline: "What we believe",
    cover: ethos["carrying-the-cross"],
  },
  {
    slug: "garment",
    href: "/explore/garment",
    index: "02",
    name: "Garment",
    tagline: "What we wear",
    cover: garment.heavyweights,
  },
  {
    slug: "events",
    href: "/explore/events",
    index: "03",
    name: "Events",
    tagline: "Where we gather",
    cover: events["speaker-cross"],
  },
] as const;

export type ExploreSlug = (typeof exploreSections)[number]["slug"];
