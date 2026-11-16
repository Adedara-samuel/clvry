import type { Metadata } from "next";
import { ProductsEditor } from "@/components/admin/products";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return <ProductsEditor />;
}
