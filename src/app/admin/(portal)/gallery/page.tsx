import type { Metadata } from "next";
import { GalleryManager } from "@/components/admin/gallery";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return <GalleryManager />;
}
