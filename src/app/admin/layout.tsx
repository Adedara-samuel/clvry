import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin — CLVRY", template: "%s — CLVRY Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
