import { commitChanges, readContent, saveContent, serialize, storeMode } from "@/lib/admin/content-store";
import { fail, guardAdmin } from "@/lib/admin/guard";
import { contentFiles, gallerySchema, gallerySections, layoutImages, productsSchema, type ContentKey } from "@/lib/content-schema";

function isKey(key: string): key is ContentKey {
  return key in contentFiles;
}

export async function GET(request: Request, ctx: { params: Promise<{ key: string }> }) {
  const denied = await guardAdmin(request);
  if (denied) return denied;
  const { key } = await ctx.params;
  if (!isKey(key)) return fail(new Error("Unknown content"), 404);
  try {
    return Response.json({ ok: true, data: await readContent(key), mode: storeMode() });
  } catch (error) {
    return fail(error);
  }
}

const messages: Record<ContentKey, string> = {
  site: "Update site settings (popup, ticker, socials)",
  playlists: "Update playlists",
  products: "Update products",
  gallery: "Update gallery",
};

export async function PUT(request: Request, ctx: { params: Promise<{ key: string }> }) {
  const denied = await guardAdmin(request);
  if (denied) return denied;
  const { key } = await ctx.params;
  if (!isKey(key)) return fail(new Error("Unknown content"), 404);

  const body = await request.json().catch(() => null);
  const parsed = contentFiles[key].schema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(new Error(issue ? `${issue.path.join(" › ")}: ${issue.message}` : "Invalid content"), 400);
  }

  try {
    if (key === "gallery") return Response.json({ ok: true, ...(await saveGallery(parsed.data)) });

    if (key === "products") {
      const products = productsSchema.parse(parsed.data);
      const gallery = await readContent("gallery");
      const slugs = new Set(gallery.garment.map((g) => g.slug));
      const missing = products.items.find((p) => !slugs.has(p.image));
      if (missing) return fail(new Error(`"${missing.name}" uses an image that isn't in the garment gallery.`), 400);
    }

    return Response.json({ ok: true, ...(await saveContent(key, parsed.data, messages[key])) });
  } catch (error) {
    return fail(error);
  }
}

/** Saves the gallery, removing the files of deleted images — unless a page or product still uses them. */
async function saveGallery(data: unknown) {
  const next = gallerySchema.parse(data);
  const [current, products] = await Promise.all([readContent("gallery"), readContent("products")]);
  const productImages = new Set(products.items.map((p) => p.image));

  const deletions: { path: string; delete: true }[] = [];
  for (const section of gallerySections) {
    const kept = new Set(next[section].map((img) => img.slug));
    for (const img of current[section]) {
      if (kept.has(img.slug)) continue;
      if (layoutImages[section].includes(img.slug)) {
        throw new Error(`"${img.slug}" is placed in the ${section} page layout, so it can't be deleted.`);
      }
      if (section === "garment" && productImages.has(img.slug)) {
        throw new Error(`"${img.slug}" is a product's image. Change or delete that product first.`);
      }
      if (img.src.startsWith(`/explore/${section}/`) && !next[section].some((n) => n.src === img.src)) {
        deletions.push({ path: `public${img.src}`, delete: true });
      }
    }
  }

  return commitChanges([{ path: contentFiles.gallery.path, content: serialize(next) }, ...deletions], messages.gallery);
}
