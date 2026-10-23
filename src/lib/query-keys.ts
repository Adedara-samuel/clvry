// Shared by server prefetching (page.tsx) and the client hooks in queries.ts.
export const queryKeys = {
  products: ["products"] as const,
  tracks: ["tracks"] as const,
};
