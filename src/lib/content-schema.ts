import { z } from "zod";

/*
 * Shapes of the editable content in src/content/*.json. The admin portal validates every save against
 * these before committing, so a bad edit can't break the site build.
 */

export const gallerySections = ["ethos", "cathedrals", "paintings", "street", "garment", "events"] as const;
export type GallerySection = (typeof gallerySections)[number];

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");

const sitePath = z.string().regex(/^\/[\w\-./]+$/, "Must be a path on this site, like /explore/garment/tee.webp");
const httpUrl = z.url({ protocol: /^https?$/, message: "Must be a full https:// link" });
const optionalUrl = z.union([z.literal(""), httpUrl]);

export const galleryImageSchema = z.object({
  slug,
  src: sitePath,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().trim().min(1, "Describe the image for screen readers").max(200),
});

export const gallerySchema = z.object(
  Object.fromEntries(gallerySections.map((s) => [s, z.array(galleryImageSchema)])) as Record<
    GallerySection,
    z.ZodArray<typeof galleryImageSchema>
  >,
);

export const socialNames = ["Instagram", "X"] as const;

export const siteSchema = z.object({
  popup: z.object({
    enabled: z.boolean(),
    delaySeconds: z.number().min(0).max(120),
    exploreRepeatMinutes: z.number().min(0.5).max(120),
    title: z.string().trim().min(1).max(60),
    description: z.string().trim().min(1).max(160),
    perks: z.array(z.string().trim().min(1).max(80)).max(6),
  }),
  ticker: z
    .array(z.object({ ref: z.string().trim().min(1).max(40), text: z.string().trim().min(1).max(400) }))
    .min(1, "Keep at least one verse"),
  socials: z.array(
    z.object({
      name: z.enum(socialNames),
      handle: z.string().trim().min(1).max(40),
      href: httpUrl,
      visible: z.boolean(),
    }),
  ),
});

export const playlistPlatforms = ["Spotify", "Audiomack"] as const;

export const playlistsSchema = z.array(
  z.object({
    title: z.string().trim().min(1).max(60),
    note: z.string().trim().max(120),
    links: z.object({ Spotify: httpUrl.optional(), Audiomack: httpUrl.optional() }),
  }),
);

export const productStatuses = ["coming-soon", "available", "sold-out"] as const;

export const productsSchema = z.object({
  currency: z.string().regex(/^[A-Z]{3}$/, "Use a 3-letter currency code, like USD"),
  items: z
    .array(
      z.object({
        id: slug,
        name: z.string().trim().min(1).max(80),
        /** Slug of an image in the garment gallery. */
        image: slug,
        status: z.enum(productStatuses),
        price: z.number().nonnegative().nullable(),
        /** Where "Shop" points once the piece is available. */
        link: optionalUrl,
        visible: z.boolean(),
      }),
    )
    .refine((items) => new Set(items.map((i) => i.id)).size === items.length, "Two products share an id"),
});

export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type GalleryContent = z.infer<typeof gallerySchema>;
export type SiteContent = z.infer<typeof siteSchema>;
export type PlaylistsContent = z.infer<typeof playlistsSchema>;
export type ProductsContent = z.infer<typeof productsSchema>;
export type ProductItem = ProductsContent["items"][number];

/** Every editable file, its schema, and its path in the repo. */
export const contentFiles = {
  site: { path: "src/content/site.json", schema: siteSchema },
  playlists: { path: "src/content/playlists.json", schema: playlistsSchema },
  products: { path: "src/content/products.json", schema: productsSchema },
  gallery: { path: "src/content/gallery.json", schema: gallerySchema },
} as const;

export type ContentKey = keyof typeof contentFiles;
export type ContentOf<K extends ContentKey> = z.infer<(typeof contentFiles)[K]["schema"]>;

/**
 * Gallery images that page layouts refer to by name (src/app/explore/*). Deleting one would break the
 * page, so the admin protects them. Keep in sync when a page starts or stops using an image by name.
 */
export const layoutImages: Record<GallerySection, readonly string[]> = {
  ethos: ["sanctuary", "communion", "glass-cross", "carrying-the-cross", "praying-hands", "crown-of-thorns"],
  cathedrals: [],
  paintings: [],
  street: [],
  garment: [
    "heavyweights",
    "crewnecks",
    "sleeveless",
    "colour-rail",
    "raw-hems",
    "denim-wall",
    "rolled-denim",
    "overshirts",
    "faith-jacket",
    "coming-soon",
    "the-way-car",
    "darkness-light",
    "the-way-cap",
    "together-in-faith",
    "cross-trucker-burgundy",
  ],
  events: [
    "elevation",
    "dj-temry",
    "bright-gallery",
    "painting-night",
    "vision-board-day",
    "vision-board",
    "neon-crosses",
    "hands-to-the-cross",
    "red-cathedral",
    "speaker-cross",
    "praising",
    "at-the-decks",
    "the-set",
    "baroque-decks",
    "the-booth",
    "crowd-of-light",
    "the-studio",
    "dj-hands",
    "gallery-night",
    "red-room",
    "hands-up",
    "jesus-raves",
  ],
};
