import { z } from "zod";
import { commitChanges, readContent, serialize } from "@/lib/admin/content-store";
import { fail, guardAdmin } from "@/lib/admin/guard";
import { contentFiles, gallerySections, galleryImageSchema } from "@/lib/content-schema";

// The browser resizes to 1400px WebP before uploading, so files are normally a few hundred KB.
const MAX_BYTES = 4 * 1024 * 1024;

const uploadSchema = z.object({
  section: z.enum(gallerySections),
  slug: galleryImageSchema.shape.slug,
  alt: galleryImageSchema.shape.alt,
  width: z.number().int().positive().max(4000),
  height: z.number().int().positive().max(4000),
  type: z.enum(["image/webp", "image/jpeg"]),
  data: z.string().min(1),
});

/** Adds an image to a gallery section: the file and the gallery entry go in one commit. */
export async function POST(request: Request) {
  const denied = await guardAdmin(request);
  if (denied) return denied;

  const parsed = uploadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(new Error(issue ? `${issue.path.join(" › ")}: ${issue.message}` : "Invalid upload"), 400);
  }
  const { section, slug, alt, width, height, type, data } = parsed.data;

  const bytes = Buffer.from(data, "base64");
  if (bytes.length > MAX_BYTES) return fail(new Error("That image is over 4 MB even after resizing."), 400);
  // Check the file really is what it claims (WebP: RIFF....WEBP; JPEG: FF D8 FF).
  const isWebp = bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if ((type === "image/webp" && !isWebp) || (type === "image/jpeg" && !isJpeg)) {
    return fail(new Error("The file isn't a valid image."), 400);
  }

  try {
    const gallery = await readContent("gallery");
    if (gallery[section].some((img) => img.slug === slug)) {
      return fail(new Error(`There's already an image called "${slug}" in ${section}. Pick another name.`), 409);
    }
    const ext = type === "image/webp" ? "webp" : "jpg";
    const src = `/explore/${section}/${slug}.${ext}`;
    const image = { slug, src, width, height, alt };
    const next = { ...gallery, [section]: [...gallery[section], image] };

    const result = await commitChanges(
      [
        { path: `public${src}`, content: bytes },
        { path: contentFiles.gallery.path, content: serialize(next) },
      ],
      `Add ${section} image: ${slug}`,
    );
    return Response.json({ ok: true, image, ...result });
  } catch (error) {
    return fail(error);
  }
}
