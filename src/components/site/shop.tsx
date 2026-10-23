"use client";

import { CrossMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/lib/queries";
import type { Product } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useBag } from "@/store/bag";
import { GarmentSilhouette } from "./garment";

const toneClass: Record<Product["tone"], string> = {
  bone: "text-paper",
  wine: "text-wine",
  ink: "text-night",
  gold: "text-goldenrod",
};

const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function Shop() {
  const { data: products, isPending, isError } = useProducts();
  const add = useBag((s) => s.add);

  return (
    <section id="shop" className="mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-gold">Drop 001</p>
          <h2 className="mt-3 font-display text-3xl uppercase md:text-5xl">Sanctuary</h2>
        </div>
        <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
          Heavyweight essentials, cut boxy and built to be worn into the ground.
        </p>
      </div>

      {isError && <p className="mt-12 text-sm text-destructive">Couldn&apos;t load the collection.</p>}

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }, (_, i) => (
              <li key={i}>
                <Skeleton className="aspect-4/5" />
              </li>
            ))
          : products?.map((p) => (
              <li key={p.id} className="group">
                <div className="relative flex aspect-4/5 items-center justify-center overflow-hidden bg-card">
                  <GarmentSilhouette
                    garment={p.garment}
                    className={cn("w-3/4 transition duration-500 group-hover:scale-105", toneClass[p.tone])}
                  />
                  <CrossMark className="absolute left-4 top-4 w-6 text-bone/30" />
                  <Button
                    onClick={() => add(p.id)}
                    className="absolute inset-x-0 bottom-0 h-11 translate-y-full font-mono text-[11px] uppercase tracking-[0.25em] group-hover:translate-y-0 focus-visible:translate-y-0"
                  >
                    Add to bag
                  </Button>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3 text-sm">
                  <div>
                    <h3 className="uppercase tracking-wide">{p.name}</h3>
                    <p className="text-muted-foreground">{p.colorway}</p>
                  </div>
                  <span className="font-mono text-gold">{price.format(p.price)}</span>
                </div>
              </li>
            ))}
      </ul>
    </section>
  );
}
