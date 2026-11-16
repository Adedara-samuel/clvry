"use client";

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { productStatuses, type GalleryImage, type ProductItem, type ProductsContent } from "@/lib/content-schema";
import { useContent, useSaveContent } from "./api";
import { AdminButton, Badge, ErrorNote, Field, Loading, PageHeader, Panel, SaveBar, Select, TextInput, Toggle } from "./ui";
import { move, removeAt, replaceAt, useDraft } from "./use-draft";

const statusLabels: Record<ProductItem["status"], string> = {
  "coming-soon": "Coming soon",
  available: "Available",
  "sold-out": "Sold out",
};

function ImagePicker({
  open,
  images,
  current,
  onPick,
  onClose,
}: {
  open: boolean;
  images: GalleryImage[];
  current?: string;
  onPick: (slug: string) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-none sm:max-w-3xl">
        <DialogTitle className="font-display text-xl font-normal uppercase">Choose a photo</DialogTitle>
        <DialogDescription className="text-sm">
          From the garment gallery.{" "}
          <Link href="/admin/gallery" className="text-gold underline-offset-4 hover:underline">
            Upload a new one there
          </Link>{" "}
          first if it&rsquo;s not here.
        </DialogDescription>
        <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img) => (
            <li key={img.slug}>
              <button
                type="button"
                onClick={() => onPick(img.slug)}
                aria-label={img.alt}
                aria-pressed={img.slug === current}
                className="relative block aspect-square w-full overflow-hidden bg-[#ece7dd] ring-gold outline-none hover:ring-2 focus-visible:ring-2 aria-pressed:ring-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" loading="lazy" className="size-full object-contain mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function ProductsEditor() {
  const products = useContent("products");
  const gallery = useContent("gallery");
  const save = useSaveContent("products");
  const draft = useDraft<ProductsContent>(products.data?.data);
  // Index of the row whose photo is being changed, or "new" when adding a product.
  const [picking, setPicking] = useState<number | "new" | null>(null);

  const garment = gallery.data?.data.garment ?? [];
  const bySlug = new Map(garment.map((g) => [g.slug, g]));
  const value = draft.value;
  const setItems = (fn: (items: ProductItem[]) => ProductItem[]) => draft.update((c) => ({ ...c, items: fn(c.items) }));

  function pick(slug: string) {
    if (picking === "new") {
      const taken = new Set(value?.items.map((i) => i.id));
      let id = slug;
      for (let n = 2; taken.has(id); n++) id = `${slug}-${n}`;
      setItems((items) => [
        ...items,
        { id, name: bySlug.get(slug)?.alt.slice(0, 80) ?? "New piece", image: slug, status: "coming-soon", price: null, link: "", visible: false },
      ]);
    } else if (typeof picking === "number") {
      setItems((items) => replaceAt(items, picking, { ...items[picking], image: slug }));
    }
    setPicking(null);
  }

  const error = products.error ?? gallery.error;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Shop"
        title="Products"
        description="CLVRY's own pieces, shown in the Design rail on /explore/garment. Set a price and a shop link when a piece goes on sale."
        actions={
          <AdminButton onClick={() => setPicking("new")} disabled={!value || !garment.length}>
            <PlusIcon aria-hidden /> Add product
          </AdminButton>
        }
      />

      {error ? (
        <ErrorNote error={error} onRetry={() => (products.refetch(), gallery.refetch())} />
      ) : !value ? (
        <Loading />
      ) : (
        <>
          <Panel title="Store settings">
            <Field label="Currency" hint="3-letter code, e.g. USD, GBP, NGN, EUR." className="max-w-48">
              <TextInput
                value={value.currency}
                maxLength={3}
                onChange={(e) => draft.update((c) => ({ ...c, currency: e.target.value.toUpperCase() }))}
              />
            </Field>
          </Panel>

          <ul className="flex flex-col gap-3">
            {value.items.map((item, i) => {
              const image = bySlug.get(item.image);
              return (
                <li key={item.id} className="flex flex-col gap-4 border border-border bg-card/40 p-4 md:flex-row">
                  <button
                    type="button"
                    onClick={() => setPicking(i)}
                    className="group relative aspect-[4/5] w-28 shrink-0 overflow-hidden bg-[#ece7dd]"
                    aria-label={`Change photo for ${item.name}`}
                  >
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image.src} alt="" className="size-full object-contain p-1 mix-blend-multiply" />
                    ) : (
                      <span className="text-xs text-destructive">Missing photo</span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-night/70 py-1 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-paper opacity-0 transition group-hover:opacity-100">
                      Change
                    </span>
                  </button>

                  <div className="grid flex-1 gap-3 md:grid-cols-2">
                    <Field label="Name" className="md:col-span-2">
                      <TextInput value={item.name} maxLength={80} onChange={(e) => setItems((l) => replaceAt(l, i, { ...item, name: e.target.value }))} />
                    </Field>
                    <Field label="Status">
                      <Select
                        value={item.status}
                        onChange={(e) => setItems((l) => replaceAt(l, i, { ...item, status: e.target.value as ProductItem["status"] }))}
                      >
                        {productStatuses.map((s) => (
                          <option key={s} value={s}>
                            {statusLabels[s]}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label={`Price (${value.currency})`} hint="Shown once the piece is available.">
                      <TextInput
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.price ?? ""}
                        placeholder="—"
                        onChange={(e) =>
                          setItems((l) => replaceAt(l, i, { ...item, price: e.target.value === "" ? null : Number(e.target.value) }))
                        }
                      />
                    </Field>
                    <Field label="Shop link" hint="Where “Shop” goes when it's available (e.g. your store page)." className="md:col-span-2">
                      <TextInput
                        type="url"
                        value={item.link}
                        placeholder="https://"
                        onChange={(e) => setItems((l) => replaceAt(l, i, { ...item, link: e.target.value.trim() }))}
                      />
                    </Field>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:w-32 md:flex-col md:items-end">
                    <div className="flex items-center gap-2">
                      {item.visible ? <Badge tone="good">Shown</Badge> : <Badge>Hidden</Badge>}
                      <Toggle
                        label={`Show ${item.name} on the site`}
                        checked={item.visible}
                        onChange={(visible) => setItems((l) => replaceAt(l, i, { ...item, visible }))}
                      />
                    </div>
                    <div className="flex">
                      <AdminButton variant="ghost" className="h-8 px-2" aria-label="Move up" disabled={i === 0} onClick={() => setItems((l) => move(l, i, i - 1))}>
                        <ArrowUpIcon aria-hidden />
                      </AdminButton>
                      <AdminButton
                        variant="ghost"
                        className="h-8 px-2"
                        aria-label="Move down"
                        disabled={i === value.items.length - 1}
                        onClick={() => setItems((l) => move(l, i, i + 1))}
                      >
                        <ArrowDownIcon aria-hidden />
                      </AdminButton>
                      <AdminButton
                        variant="ghost"
                        className="h-8 px-2 text-destructive"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => window.confirm(`Delete "${item.name}"? Its photo stays in the gallery.`) && setItems((l) => removeAt(l, i))}
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

      <ImagePicker
        open={picking !== null}
        images={garment}
        current={typeof picking === "number" ? value?.items[picking]?.image : undefined}
        onPick={pick}
        onClose={() => setPicking(null)}
      />

      <SaveBar
        dirty={draft.dirty}
        saving={save.isPending}
        onSave={() => value && save.mutate(value, { onSuccess: draft.reset })}
        onDiscard={draft.reset}
      />
    </div>
  );
}
