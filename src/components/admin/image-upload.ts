"use client";

/** Matches the existing gallery files: longest side 1400px. */
const MAX_SIDE = 1400;

export type PreparedImage = { data: string; type: "image/webp" | "image/jpeg"; width: number; height: number; previewUrl: string };

/**
 * Resizes in the browser and re-encodes as WebP (JPEG where the browser can't encode WebP), so
 * uploads stay small and every gallery file has the same treatment.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) throw new Error("That isn't an image file.");
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("This browser can't read that image. Try a JPEG, PNG or WebP.");
  });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't process the image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string, quality: number) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  let blob = await encode("image/webp", 0.85);
  if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg", 0.88);
  if (!blob) throw new Error("Couldn't encode the image.");

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Couldn't read the image."));
    reader.readAsDataURL(blob);
  });

  return {
    data: dataUrl.slice(dataUrl.indexOf(",") + 1),
    type: blob.type as PreparedImage["type"],
    width,
    height,
    previewUrl: URL.createObjectURL(blob),
  };
}
