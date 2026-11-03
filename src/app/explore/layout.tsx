import { ExploreNav } from "@/components/explore/explore-nav";

export default function ExploreLayout({ children }: LayoutProps<"/explore">) {
  return (
    // The dock floats at the left from md up (clear it), and at the bottom on phones (leave room).
    <div className="min-h-svh bg-background text-foreground md:pl-24">
      <ExploreNav />
      <main className="pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
    </div>
  );
}
