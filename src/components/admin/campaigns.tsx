"use client";

import { ExternalLinkIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useMailbox, useRefreshMailbox } from "./api";
import { AdminButton, ErrorNote, formatDate, Loading, PageHeader } from "./ui";

function gmailLink(messageId?: string) {
  if (!messageId) return null;
  const id = messageId.replace(/^<|>$/g, "");
  return `https://mail.google.com/mail/u/0/#search/rfc822msgid%3A${encodeURIComponent(id)}`;
}

export function Campaigns() {
  const mailbox = useMailbox();
  const refresh = useRefreshMailbox();
  const campaigns = mailbox.data?.campaigns ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Email marketing"
        title="Campaigns"
        description="Branded emails to everyone on the list, sent through the site's Gmail. Each send is recorded in the inbox, and this history is read from there."
        actions={
          <>
            <AdminButton variant="outline" onClick={() => refresh.mutate()} disabled={refresh.isPending}>
              <RefreshCwIcon className={refresh.isPending ? "animate-spin" : undefined} aria-hidden />
              Refresh
            </AdminButton>
            <Link
              href="/admin/campaigns/new"
              className="inline-flex h-9 items-center gap-2 bg-primary px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/85"
            >
              <PlusIcon className="size-3.5" aria-hidden />
              New campaign
            </Link>
          </>
        }
      />

      {mailbox.isPending ? (
        <Loading label="Reading campaign history from Gmail…" />
      ) : mailbox.error ? (
        <ErrorNote error={mailbox.error} onRetry={() => mailbox.refetch()} />
      ) : campaigns.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="font-display text-lg uppercase">No campaigns yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Write the first one: a drop announcement, an event invite, a word of encouragement.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-normal">Subject</th>
                <th className="px-4 py-3 font-normal">Sent</th>
                <th className="px-4 py-3 font-normal">Recipients</th>
                <th className="px-4 py-3 font-normal">Failed</th>
                <th className="px-4 py-3 font-normal">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((c) => {
                const link = gmailLink(c.messageId);
                return (
                  <tr key={`${c.sentAt}-${c.subject}`} className="hover:bg-muted/30">
                    <td className="px-4 py-3">{c.subject}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(c.sentAt, true)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.sent ?? "?"}
                      {c.recipients !== null && c.recipients !== c.sent ? ` of ${c.recipients}` : ""}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.failed ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold hover:underline"
                        >
                          In Gmail <ExternalLinkIcon className="size-3" aria-hidden />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs leading-relaxed text-muted-foreground">
        Gmail can&rsquo;t report opens or clicks. Replies to a campaign land in the site&rsquo;s inbox, and anyone who unsubscribes is
        taken off the list automatically.
      </p>
    </div>
  );
}
