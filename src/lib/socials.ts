import content from "@/content/site.json";
import type { SiteContent } from "./content-schema";

/** Social handles, from src/content/site.json (edited at /admin/content). Hidden ones are left out. */
export const socials = (content as SiteContent).socials.filter((s) => s.visible);

export type Social = SiteContent["socials"][number];
