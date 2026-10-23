import type { Product, Track } from "./schemas";

// Placeholder catalog until a CMS / commerce backend is wired in.
export const products: Product[] = [
  { id: "sanctuary-hoodie", name: "Sanctuary Hoodie", colorway: "Bone", price: 145, garment: "hoodie", tone: "bone" },
  { id: "golgotha-tee", name: "Golgotha Boxy Tee", colorway: "Wine", price: 65, garment: "tee", tone: "wine" },
  { id: "pilgrim-pant", name: "Pilgrim Wide Pant", colorway: "Black", price: 120, garment: "pant", tone: "ink" },
  { id: "crown-cap", name: "Crown Six-Panel", colorway: "Goldenrod", price: 48, garment: "cap", tone: "gold" },
];

export const tracks: Track[] = [
  { id: "01", title: "Altar Call", scripture: "Romans 12:1", duration: "3:42" },
  { id: "02", title: "Hill Country", scripture: "Luke 23:33", duration: "4:05" },
  { id: "03", title: "Wings of the Morning", scripture: "Psalm 139:9", duration: "3:18" },
  { id: "04", title: "Third Day", scripture: "1 Corinthians 15:4", duration: "5:11" },
];
