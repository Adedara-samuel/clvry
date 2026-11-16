import products from "@/content/products.json";
import type { ProductsContent } from "./content-schema";
import { garment, type ExploreImage } from "./explore";

/*
 * CLVRY's own pieces, shown in the Design rail on /explore/garment. Edited from the admin portal
 * (/admin/products) and stored in src/content/products.json; each image is a slug in the garment gallery.
 */

const content = products as ProductsContent;

export type Piece = ProductsContent["items"][number] & { picture: ExploreImage };

/** Every product whose image exists, hidden ones included (their images stay off the public boards). */
export const allPieces: Piece[] = content.items.flatMap((item) => {
  const picture = garment[item.image];
  return picture ? [{ ...item, picture }] : [];
});

export const pieces = allPieces.filter((p) => p.visible);

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: content.currency, maximumFractionDigits: 2 });

/** The label under a piece: its price once it's on sale, otherwise its status. */
export function pieceLabel(piece: Piece) {
  if (piece.status === "sold-out") return "Sold out";
  if (piece.status === "available") return piece.price === null ? "Available" : money.format(piece.price);
  return "Coming soon";
}
