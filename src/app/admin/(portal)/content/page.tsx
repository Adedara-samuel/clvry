import type { Metadata } from "next";
import { SiteContentEditor } from "@/components/admin/site-content";

export const metadata: Metadata = { title: "Site content" };

export default function ContentPage() {
  return <SiteContentEditor />;
}
