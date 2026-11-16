"use client";

import { CheckIcon, RefreshCwIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMailbox, useRefreshMailbox, useStatus } from "./api";
import { AdminButton, ErrorNote, formatDate, Loading, PageHeader, Panel, Stat } from "./ui";

const WEEK = 7 * 24 * 60 * 60 * 1000;

function Check({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <li className="flex gap-3 py-2 text-sm">
      {ok ? (
        <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-label="Done" />
      ) : (
        <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-gold" aria-label="Needs attention" />
      )}
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

export function Dashboard() {
  const status = useStatus();
  const mailbox = useMailbox();
  const refresh = useRefreshMailbox();

  const subscribers = mailbox.data?.subscribers ?? [];
  const active = subscribers.filter((s) => s.status === "active");
  // Computed from the data's own fetch time, so the render stays pure.
  const fetchedAt = mailbox.data ? new Date(mailbox.data.fetchedAt).getTime() : 0;
  const newThisWeek = active.filter((s) => fetchedAt - new Date(s.joinedAt).getTime() < WEEK).length;
  const campaigns = mailbox.data?.campaigns ?? [];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Everything on the site, from one place. Subscribers and campaign history are read from the site's Gmail; content edits are saved to the repo."
        actions={
          <AdminButton variant="outline" onClick={() => refresh.mutate()} disabled={refresh.isPending}>
            <RefreshCwIcon className={refresh.isPending ? "animate-spin" : undefined} aria-hidden />
            Refresh from Gmail
          </AdminButton>
        }
      />

      {mailbox.isPending ? (
        <Loading label="Reading the list from Gmail…" />
      ) : mailbox.error ? (
        <ErrorNote error={mailbox.error} onRetry={() => mailbox.refetch()} />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Subscribers" value={active.length} note="Active on the list" />
          <Stat label="New this week" value={newThisWeek} />
          <Stat label="Unsubscribed" value={subscribers.length - active.length} />
          <Stat
            label="Campaigns"
            value={campaigns.length}
            note={campaigns[0] ? `Last: ${formatDate(campaigns[0].sentAt)}` : "None sent yet"}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Newest subscribers"
          actions={
            <Link href="/admin/subscribers" className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold hover:underline">
              All subscribers →
            </Link>
          }
        >
          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground">{mailbox.isPending ? "…" : "No one has signed up yet."}</p>
          ) : (
            <ul className="divide-y divide-border">
              {active.slice(0, 6).map((s) => (
                <li key={s.email} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                  <span className="truncate">{s.email}</span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{formatDate(s.joinedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Setup" description="What the portal needs to work fully.">
          {status.isPending ? (
            <Loading />
          ) : status.error ? (
            <ErrorNote error={status.error} />
          ) : (
            <ul className="divide-y divide-border">
              <Check ok={status.data.mail.ok}>
                {status.data.mail.ok ? (
                  <>
                    Email sends from <strong>{status.data.mail.sender}</strong>; notifications go to{" "}
                    <strong>{status.data.mail.inbox}</strong>.
                  </>
                ) : (
                  status.data.mail.error
                )}
              </Check>
              <Check ok={!mailbox.error && !mailbox.isPending}>
                {mailbox.error ? "Gmail can't be read over IMAP yet (see the error above)." : "Gmail is readable over IMAP."}
              </Check>
              <Check ok={status.data.store.mode === "github"}>
                {status.data.store.mode === "github" ? (
                  <>
                    Edits commit to <strong>{status.data.store.repo}</strong> ({status.data.store.branch}) and go live after the
                    redeploy.
                  </>
                ) : status.data.store.mode === "local" ? (
                  "Dev mode: edits are written to src/content on this machine. Add GITHUB_TOKEN and GITHUB_REPO to save from the live site."
                ) : (
                  "Saving is off: add GITHUB_TOKEN and GITHUB_REPO to the environment variables."
                )}
              </Check>
              <Check ok={status.data.siteUrlSet}>
                {status.data.siteUrlSet ? (
                  <>Email links point to {status.data.siteUrl}.</>
                ) : (
                  <>Set SITE_URL so email links always point to the live site (using {status.data.siteUrl} for now).</>
                )}
              </Check>
              <Check ok={!status.data.weakPassword}>
                {status.data.weakPassword
                  ? "The admin password is short and easy to guess. Change ADMIN_PASSWORD to something longer before launch."
                  : "The admin password is a decent length."}
              </Check>
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        title="Recent campaigns"
        actions={
          <Link href="/admin/campaigns/new" className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold hover:underline">
            New campaign →
          </Link>
        }
      >
        {campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No campaigns yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {campaigns.slice(0, 5).map((c) => (
              <li key={`${c.sentAt}-${c.subject}`} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <span className="truncate">{c.subject}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {c.sent ?? "?"} sent · {formatDate(c.sentAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
