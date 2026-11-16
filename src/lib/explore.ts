import gallery from "@/content/gallery.json";
import type { GallerySection } from "./content-schema";

/*
 * The Explore pages (/explore/ethos, /garment, /events). Images live in public/explore/<section>/,
 * pre-sized to 1400px WebP; width/height are the files' intrinsic size so next/image can reserve space.
 *
 * The list itself is src/content/gallery.json, edited from the admin portal (/admin/gallery). Pages
 * pick some images by slug (see `layoutImages` in content-schema.ts, which the admin won't delete);
 * anything else in a section lands on that page's board.
 */

export type ExploreImage = { src: string; width: number; height: number; alt: string };

function section(name: GallerySection): Record<string, ExploreImage> {
  return Object.fromEntries(gallery[name].map(({ slug, ...img }) => [slug, img]));
}

export const ethos = section("ethos");
export const cathedrals = section("cathedrals");
export const paintings = section("paintings");
export const street = section("street");
export const garment = section("garment");
export const events = section("events");

/** Images in `group` that the page hasn't placed anywhere yet, e.g. new uploads from the admin. */
export function unplaced(group: Record<string, ExploreImage>, placed: Iterable<ExploreImage>) {
  const used = new Set(placed);
  return Object.values(group).filter((img) => !used.has(img));
}

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
    cover: garment["cross-trucker-burgundy"],
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
