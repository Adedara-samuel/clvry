import { Suspense } from "react";
import { AdminShell } from "@/components/admin/shell";
import { Loading } from "@/components/admin/ui";

// The pages are client components that fetch through /api/admin (TanStack Query), so they sit
// inside Suspense: useQuery reads the clock, which can't happen during prerender.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </AdminShell>
  );
}
