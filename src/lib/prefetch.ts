import { dehydrate, QueryClient } from "@tanstack/react-query";
import { products, tracks } from "./catalog";
import { queryKeys } from "./query-keys";

// Cached so the Date.now() inside dehydrate runs once at prerender, as Cache Components requires.
export async function getLandingState() {
  "use cache";
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: queryKeys.products, queryFn: () => products }),
    queryClient.prefetchQuery({ queryKey: queryKeys.tracks, queryFn: () => tracks }),
  ]);
  return dehydrate(queryClient);
}
