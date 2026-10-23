export const socials = [
  { name: "Instagram", handle: "@clvrywrld", href: "https://www.instagram.com/clvrywrld" },
  { name: "X", handle: "@clvrywrld", href: "https://x.com/clvrywrld" },
] as const;

export type Social = (typeof socials)[number];
