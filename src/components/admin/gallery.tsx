"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon, CopyIcon, ImagePlusIcon, LockIcon, Trash2Icon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { gallerySections, layoutImages, type GalleryContent, type GalleryImage, type GallerySection } from "@/lib/content-schema";
import { cn } from "@/lib/utils";
import { adminKeys, api, savedMessage, useContent, useSaveContent, type StoreMode } from "./api";
import { prepareImage, type PreparedImage } from "./image-upload";
import { AdminButton, ErrorNote, Field, Loading, PageHeader, Panel, SaveBar, TextArea, TextInput, slugify } from "./ui";
import { move, removeAt, replaceAt, useDraft } from "./use-draft";

const sectionNotes: Record<GallerySection, string> = {
  ethos: "/explore/ethos. New images join the board at the bottom of the page.",
  cathedrals: "The Cathedrals rail on /explore/ethos.",
  paintings: "The Paintings rail on /explore/ethos.",
  street: "The Out in the street board on /explore/garment.",
  garment: "/explore/garment. Product photos live here too; new images that aren't a product join the street board.",
  events: "/explore/events. New images join the end of the Night board.",
};

/** Thumbnail that copes with images committed but not deployed yet. */
function Thumb({ image, preview }: { image: GalleryImage; preview?: string }) {
  const [broken, setBroken] = useState(false);
  if (broken && !preview) {
    return (
      <div className="flex size-full items-center justify-center p-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        Live after the redeploy
      </div>
    );
  }
  // Plain <img>: these are admin thumbnails, and new files may not be served yet.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={preview ?? image.src} alt="" loading="lazy" onError={() => setBroken(true)} className="size-full object-cover" />;
}

function UploadPanel({
  section,
  existing,
  blocked,
  onUploaded,
}: {
  section: GallerySection;
  existing: GalleryImage[];
  blocked: boolean;
  onUploaded: (image: GalleryImage, preview: string, mode: StoreMode) => void;
}) {
  const [prepared, setPrepared] = useState<PreparedImage | null>(null);
  const [slug, setSlug] = useState("");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const image = await prepareImage(file);
      setPrepared(image);
      setSlug(slugify(file.name.replace(/\.[^.]+$/, "")));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const upload = useMutation({
    mutationFn: () =>
      api<{ ok: true; image: GalleryImage; mode: StoreMode }>("/api/admin/gallery/upload", {
        body: { section, slug, alt, width: prepared!.width, height: prepared!.height, type: prepared!.type, data: prepared!.data },
      }),
    onSuccess: ({ image, mode }) => {
      onUploaded(image, prepared!.previewUrl, mode);
      setPrepared(null);
      setSlug("");
      setAlt("");
    },
    onError: (error) => toast.error(error.message),
  });

  const taken = existing.some((img) => img.slug === slug);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (blocked) return toast.error("Save or discard your other changes first.");
    if (!prepared || !slug || !alt.trim() || taken) return;
    upload.mutate();
  }

  return (
    <Panel title={`Add to ${section}`} description="Images are resized to 1400px and converted to WebP in your browser before upload.">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-[160px_1fr]">
        <label
          className={cn(
            "relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border border-dashed border-input text-center text-xs text-muted-foreground hover:border-ring",
            busy && "opacity-60",
          )}
        >
          {prepared ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={prepared.previewUrl} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <>
              <ImagePlusIcon className="size-5" aria-hidden />
              {busy ? "Preparing…" : "Choose image"}
            </>
          )}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} disabled={busy} />
        </label>
        <div className="grid content-start gap-3">
          <Field
            label="Name (used in the file name)"
            hint={taken ? <span className="text-destructive">That name is taken in {section}.</span> : prepared ? `${prepared.width}×${prepared.height}px` : undefined}
          >
            <TextInput value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="praise-night" required />
          </Field>
          <Field label="Description" hint="Read aloud by screen readers. Say what's in the picture.">
            <TextInput value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={200} required placeholder="Hands raised to a lit cross" />
          </Field>
          <div>
            <AdminButton type="submit" disabled={!prepared || !slug || !alt.trim() || taken || upload.isPending}>
              {upload.isPending ? "Uploading…" : "Upload"}
            </AdminButton>
          </div>
        </div>
      </form>
    </Panel>
  );
}

export function GalleryManager() {
  const client = useQueryClient();
  const [section, setSection] = useState<GallerySection>("ethos");
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const gallery = useContent("gallery");
  const products = useContent("products");
  const save = useSaveContent("gallery");
  const draft = useDraft<GalleryContent>(gallery.data?.data);

  const productImages = new Set(products.data?.data.items.map((p) => p.image) ?? []);
  const protectedReason = (s: GallerySection, slug: string) =>
    layoutImages[s].includes(slug)
      ? "Placed in the page layout"
      : s === "garment" && productImages.has(slug)
        ? "Used by a product"
        : null;

  const images = draft.value?.[section] ?? [];
  const setImages = (fn: (list: GalleryImage[]) => GalleryImage[]) => draft.update((g) => ({ ...g, [section]: fn(g[section]) }));

  function uploaded(image: GalleryImage, preview: string, mode: StoreMode) {
    setPreviews((p) => ({ ...p, [image.src]: preview }));
    client.setQueryData(adminKeys.content("gallery"), (old: typeof gallery.data) =>
      old && { ...old, data: { ...old.data, [section]: [...old.data[section], image] } },
    );
    toast.success(`Image added. ${savedMessage(mode)}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Content"
        title="Gallery"
        description="The images on the Explore pages. Upload new ones, rewrite descriptions, reorder, or remove the ones a page doesn't place by name."
      />

      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {gallerySections.map((s) => (
          <button
            key={s}
            role="tab"
            type="button"
            aria-selected={section === s}
            onClick={() => setSection(s)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 font-mono text-[10px] whitespace-nowrap uppercase tracking-[0.2em] transition-colors",
              section === s ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {s} <span className="text-muted-foreground">{draft.value?.[s].length ?? ""}</span>
          </button>
        ))}
      </div>
      <p className="-mt-2 text-sm text-muted-foreground">{sectionNotes[section]}</p>

      {gallery.error ? (
        <ErrorNote error={gallery.error} onRetry={() => gallery.refetch()} />
      ) : !draft.value ? (
        <Loading />
      ) : (
        <>
          <UploadPanel section={section} existing={images} blocked={draft.dirty} onUploaded={uploaded} />

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, i) => {
              const locked = protectedReason(section, image.slug);
              return (
                <li key={image.slug} className="flex flex-col border border-border bg-card/40">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Thumb image={image} preview={previews[image.src]} />
                    {locked && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-background/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em]">
                        <LockIcon className="size-3" aria-hidden /> {locked}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-mono text-[10px] text-muted-foreground" title={image.src}>
                        {image.slug}
                      </p>
                      <p className="shrink-0 font-mono text-[9px] text-muted-foreground">
                        {image.width}×{image.height}
                      </p>
                    </div>
                    <TextArea
                      aria-label={`Description of ${image.slug}`}
                      value={image.alt}
                      maxLength={200}
                      className="min-h-16 text-xs"
                      onChange={(e) => setImages((list) => replaceAt(list, i, { ...image, alt: e.target.value }))}
                    />
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex">
                        <AdminButton variant="ghost" className="h-8 px-2" aria-label="Move earlier" disabled={i === 0} onClick={() => setImages((l) => move(l, i, i - 1))}>
                          <ArrowLeftIcon aria-hidden />
                        </AdminButton>
                        <AdminButton
                          variant="ghost"
                          className="h-8 px-2"
                          aria-label="Move later"
                          disabled={i === images.length - 1}
                          onClick={() => setImages((l) => move(l, i, i + 1))}
                        >
                          <ArrowRightIcon aria-hidden />
                        </AdminButton>
                        <AdminButton
                          variant="ghost"
                          className="h-8 px-2"
                          aria-label="Copy image path"
                          title="Copy path (for a campaign image)"
                          onClick={() => navigator.clipboard.writeText(image.src).then(() => toast.success("Path copied."))}
                        >
                          <CopyIcon aria-hidden />
                        </AdminButton>
                      </div>
                      <AdminButton
                        variant="ghost"
                        className="h-8 px-2 text-destructive"
                        disabled={Boolean(locked)}
                        title={locked ? `Can't delete: ${locked.toLowerCase()}` : "Delete"}
                        aria-label="Delete image"
                        onClick={() => setImages((l) => removeAt(l, i))}
                      >
                        <Trash2Icon aria-hidden />
                      </AdminButton>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <SaveBar
        dirty={draft.dirty}
        saving={save.isPending}
        onSave={() => draft.value && save.mutate(draft.value, { onSuccess: draft.reset })}
        onDiscard={draft.reset}
      />
    </div>
  );
}
