"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DownloadIcon, PlusIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { Subscriber } from "@/lib/admin/gmail";
import { adminKeys, api, useMailbox, useRefreshMailbox } from "./api";
import { AdminButton, Badge, ErrorNote, Field, formatDate, Loading, PageHeader, Panel, Select, TextInput } from "./ui";

type Filter = "active" | "unsubscribed" | "all";

function toCsv(rows: Subscriber[]) {
  const cell = (v: string | undefined) => {
    const s = v ?? "";
    // Quote everything; neutralise leading =,+,-,@ so spreadsheets don't run it as a formula.
    return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
  };
  const head = ["email", "phone", "status", "joined", "unsubscribed", "source"];
  const lines = rows.map((r) => [r.email, r.phone, r.status, r.joinedAt, r.unsubscribedAt, r.source].map(cell).join(","));
  return [head.join(","), ...lines].join("\r\n");
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

export function Subscribers() {
  const client = useQueryClient();
  const mailbox = useMailbox();
  const refresh = useRefreshMailbox();
  const [filter, setFilter] = useState<Filter>("active");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);

  const all = mailbox.data?.subscribers;
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (all ?? []).filter(
      (s) => (filter === "all" || s.status === filter) && (!q || s.email.includes(q) || s.phone?.includes(q)),
    );
  }, [all, filter, query]);

  // Gmail needs a moment to index the new email, so re-read shortly after a change.
  const afterChange = () => setTimeout(() => refresh.mutate(), 2500);

  const add = useMutation({
    mutationFn: (input: { email: string; phone?: string }) => api("/api/admin/subscribers", { body: input }),
    onSuccess: (_, input) => {
      toast.success(`${input.email} added. They'll show in the list in a moment.`);
      setAdding(false);
      afterChange();
    },
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: (email: string) => api("/api/admin/subscribers", { method: "DELETE", body: { email } }),
    onSuccess: (_, email) => {
      toast.success(`${email} is off the list.`);
      // Show it straight away; the refresh confirms it from Gmail.
      client.setQueryData(adminKeys.mailbox, (old: typeof mailbox.data) =>
        old && {
          ...old,
          subscribers: old.subscribers.map((s) =>
            s.email === email ? { ...s, status: "unsubscribed" as const, unsubscribedAt: new Date().toISOString() } : s,
          ),
        },
      );
      afterChange();
    },
    onError: (error) => toast.error(error.message),
  });

  function submitAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") ?? "").trim();
    add.mutate({ email: String(form.get("email") ?? "").trim(), ...(phone ? { phone } : {}) });
  }

  const counts = {
    active: all?.filter((s) => s.status === "active").length ?? 0,
    unsubscribed: all?.filter((s) => s.status === "unsubscribed").length ?? 0,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Audience"
        title="Subscribers"
        description="Everyone who signed up on the site, rebuilt from the sign-up emails in Gmail. Archive those emails if you like, but don't delete them."
        actions={
          <>
            <AdminButton variant="outline" onClick={() => refresh.mutate()} disabled={refresh.isPending}>
              <RefreshCwIcon className={refresh.isPending ? "animate-spin" : undefined} aria-hidden />
              Refresh
            </AdminButton>
            <AdminButton
              variant="outline"
              disabled={!rows.length}
              onClick={() => download(`clvry-subscribers-${filter}.csv`, toCsv(rows))}
            >
              <DownloadIcon aria-hidden />
              Export CSV
            </AdminButton>
            <AdminButton onClick={() => setAdding((v) => !v)}>
              <PlusIcon aria-hidden />
              Add subscriber
            </AdminButton>
          </>
        }
      />

      {adding && (
        <Panel title="Add a subscriber" description="For people who signed up in person. They'll get campaigns like everyone else.">
          <form onSubmit={submitAdd} className="grid gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end">
            <Field label="Email">
              <TextInput name="email" type="email" required placeholder="name@example.com" />
            </Field>
            <Field label="Phone (optional)">
              <TextInput name="phone" type="tel" placeholder="+44 …" />
            </Field>
            <AdminButton type="submit" disabled={add.isPending}>
              {add.isPending ? "Adding…" : "Add"}
            </AdminButton>
          </form>
        </Panel>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email or phone"
            aria-label="Search subscribers"
            className="pl-9"
          />
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} aria-label="Show" className="md:w-56">
          <option value="active">Active ({counts.active})</option>
          <option value="unsubscribed">Unsubscribed ({counts.unsubscribed})</option>
          <option value="all">Everyone ({all?.length ?? 0})</option>
        </Select>
      </div>

      {mailbox.isPending ? (
        <Loading label="Reading the list from Gmail…" />
      ) : mailbox.error ? (
        <ErrorNote error={mailbox.error} onRetry={() => mailbox.refetch()} />
      ) : rows.length === 0 ? (
        <p className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {query ? "No one matches that search." : "No subscribers here yet."}
        </p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Phone</th>
                <th className="px-4 py-3 font-normal">Joined</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((s) => (
                <tr key={s.email} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <a href={`mailto:${s.email}`} className="hover:text-gold">
                      {s.email}
                    </a>
                    {s.source && s.source !== "CLVRY website · Newsletter sign-up form" && (
                      <span className="block text-xs text-muted-foreground">{s.source}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.phone ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(s.joinedAt)}</td>
                  <td className="px-4 py-3">
                    {s.status === "active" ? (
                      <Badge tone="good">Active</Badge>
                    ) : (
                      <span title={s.unsubscribedAt ? `Since ${formatDate(s.unsubscribedAt)}` : undefined}>
                        <Badge>Unsubscribed</Badge>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.status === "active" && (
                      <AdminButton
                        variant="ghost"
                        className="h-7 px-2 text-destructive"
                        disabled={remove.isPending}
                        onClick={() => {
                          if (window.confirm(`Take ${s.email} off the list? They won't get campaigns unless they sign up again.`)) {
                            remove.mutate(s.email);
                          }
                        }}
                      >
                        Remove
                      </AdminButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {mailbox.data && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Read from Gmail {formatDate(mailbox.data.fetchedAt, true)}
        </p>
      )}
    </div>
  );
}
