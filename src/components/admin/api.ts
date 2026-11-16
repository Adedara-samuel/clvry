"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CampaignRecord, Subscriber } from "@/lib/admin/gmail";
import type { ContentKey, ContentOf } from "@/lib/content-schema";

/*
 * Client side of the admin API. Every call goes through `api()`, which throws the server's error
 * message (shown in a toast) and sends the browser back to the login when the session has expired.
 */

export async function api<T = { ok: true }>(url: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? (init?.body === undefined ? "GET" : "POST"),
    headers: init?.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (res.status === 401) {
    window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname)}`);
  }
  if (!res.ok || data.ok === false) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export type StoreMode = "github" | "local" | "none";

export type Status = {
  mail: { ok: boolean; sender?: string; inbox?: string; error?: string };
  store: { mode: StoreMode; repo: string | null; branch: string };
  siteUrl: string;
  siteUrlSet: boolean;
  weakPassword: boolean;
};

export type Mailbox = { subscribers: Subscriber[]; campaigns: CampaignRecord[]; fetchedAt: string };

export const adminKeys = {
  status: ["admin", "status"] as const,
  mailbox: ["admin", "mailbox"] as const,
  content: (key: ContentKey) => ["admin", "content", key] as const,
};

export function useStatus() {
  return useQuery({ queryKey: adminKeys.status, queryFn: () => api<Status & { ok: true }>("/api/admin/status") });
}

export function useMailbox() {
  return useQuery({
    queryKey: adminKeys.mailbox,
    queryFn: () => api<Mailbox & { ok: true }>("/api/admin/mailbox"),
    staleTime: 60 * 1000,
  });
}

/** Re-reads Gmail, skipping the server's one-minute cache. */
export function useRefreshMailbox() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => api<Mailbox & { ok: true }>("/api/admin/mailbox?fresh=1"),
    onSuccess: (data) => client.setQueryData(adminKeys.mailbox, data),
    onError: (error) => toast.error(error.message),
  });
}

export function useContent<K extends ContentKey>(key: K) {
  return useQuery({
    queryKey: adminKeys.content(key),
    queryFn: () => api<{ ok: true; data: ContentOf<K>; mode: StoreMode }>(`/api/admin/content/${key}`),
    staleTime: Infinity,
  });
}

export function savedMessage(mode: StoreMode) {
  return mode === "github"
    ? "Saved. The site picks it up after the redeploy, in about 1–2 minutes."
    : "Saved to src/content. Commit and push to publish it.";
}

export function useSaveContent<K extends ContentKey>(key: K) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: ContentOf<K>) =>
      api<{ ok: true; mode: StoreMode }>(`/api/admin/content/${key}`, { method: "PUT", body: data }).then((r) => ({
        ...r,
        data,
      })),
    onSuccess: ({ mode, data }) => {
      client.setQueryData(adminKeys.content(key), { ok: true, data, mode });
      toast.success(savedMessage(mode));
    },
    onError: (error) => toast.error(error.message),
  });
}
