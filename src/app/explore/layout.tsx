import { ExploreNav } from "@/components/explore/explore-nav";

export default function ExploreLayout({ children }: LayoutProps<"/explore">) {
  return (
    // Rail on the left from md up; on phones the dock floats at the bottom, so leave room for it.
    <div className="min-h-svh bg-background text-foreground md:pl-28">
      <ExploreNav />
      <main className="pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
    </div>
  );
}
