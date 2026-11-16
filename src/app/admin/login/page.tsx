import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { CrossMark } from "@/components/brand/logo";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-sm">
        <CrossMark className="mx-auto w-14 text-gold" />
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          CLVRY
        </p>
        <h1 className="mt-2 text-center font-display text-2xl uppercase tracking-[0.1em]">Admin</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
