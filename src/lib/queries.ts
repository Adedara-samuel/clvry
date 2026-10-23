import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { queryKeys } from "./query-keys";
import { productSchema, trackSchema, type SubscribeInput } from "./schemas";

async function getJson<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request to ${url} failed (${res.status})`);
  return schema.parse(await res.json());
}

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => getJson("/api/products", z.array(productSchema)),
  });
}

export function useTracks() {
  return useQuery({
    queryKey: queryKeys.tracks,
    queryFn: () => getJson("/api/tracks", z.array(trackSchema)),
  });
}

export function useSubscribe() {
  return useMutation({
    mutationFn: async (input: SubscribeInput) => {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong");
      return data;
    },
  });
}
