"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SendIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { campaignSchema, emptyCampaign, GMAIL_DAILY_LIMIT, SEND_BATCH_SIZE, type Campaign } from "@/lib/campaign-schema";
import { adminKeys, api, useMailbox, useStatus } from "./api";
import { AdminButton, Field, PageHeader, Panel, TextArea, TextInput } from "./ui";

const DRAFT_KEY = "clvry-admin-campaign-draft";

type Progress = { total: number; done: number; sent: number; failed: string[]; stopped?: string; finished: boolean };
type BatchResult = { ok: true; sent: string[]; failed: { email: string; error: string }[]; stopped?: string };

function loadDraft(): Campaign {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
    return { ...emptyCampaign, ...(saved && typeof saved === "object" ? saved : {}) };
  } catch {
    return emptyCampaign;
  }
}

export function CampaignComposer() {
  const client = useQueryClient();
  const status = useStatus();
  const mailbox = useMailbox();
  const [campaign, setCampaign] = useState<Campaign>(emptyCampaign);
  const [loaded, setLoaded] = useState(false);
  const [html, setHtml] = useState("");
  const [testTo, setTestTo] = useState("");
  const [testing, setTesting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const previewSeq = useRef(0);

  const recipients = (mailbox.data?.subscribers ?? []).filter((s) => s.status === "active").map((s) => s.email);
  const sending = progress !== null && !progress.finished;

  // Restore the draft once on mount (localStorage only exists in the browser).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setCampaign(loadDraft());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(campaign));
    } catch {}
  }, [campaign, loaded]);

  // Live preview, debounced; stale responses are ignored.
  useEffect(() => {
    const seq = ++previewSeq.current;
    const timer = setTimeout(() => {
      api<{ ok: true; html: string }>("/api/admin/campaigns/preview", { body: campaign })
        .then((r) => seq === previewSeq.current && setHtml(r.html))
        .catch(() => {});
    }, 350);
    return () => clearTimeout(timer);
  }, [campaign]);

  // Leaving mid-send would stop it part-way.
  useEffect(() => {
    if (!sending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [sending]);

  const set = (key: keyof Campaign) => (e: { target: { value: string } }) => setCampaign((c) => ({ ...c, [key]: e.target.value }));

  function validated() {
    const parsed = campaignSchema.safeParse(campaign);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      toast.error(issue ? `${String(issue.path[0] ?? "")}: ${issue.message}` : "Check the campaign fields");
      return null;
    }
    return parsed.data;
  }

  async function sendTest() {
    const data = validated();
    if (!data) return;
    const to = (testTo || status.data?.mail.inbox || "").trim();
    if (!to) return toast.error("Enter an address for the test");
    setTesting(true);
    try {
      const result = await api<BatchResult>("/api/admin/campaigns/send", { body: { campaign: data, recipients: [to], test: true } });
      if (result.failed.length) throw new Error(result.failed[0].error);
      toast.success(`Test sent to ${to}.`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setTesting(false);
    }
  }

  async function sendTo(list: string[]) {
    const data = validated();
    if (!data || list.length === 0) return;
    setConfirming(false);
    const state: Progress = { total: list.length, done: 0, sent: 0, failed: [], finished: false };
    setProgress({ ...state });

    for (let i = 0; i < list.length; i += SEND_BATCH_SIZE) {
      const batch = list.slice(i, i + SEND_BATCH_SIZE);
      try {
        const result = await api<BatchResult>("/api/admin/campaigns/send", { body: { campaign: data, recipients: batch } });
        state.sent += result.sent.length;
        state.failed.push(...result.failed.map((f) => f.email));
        if (result.stopped) {
          const handled = new Set([...result.sent, ...result.failed.map((f) => f.email)]);
          state.failed.push(...list.slice(i).filter((e) => !handled.has(e)));
          state.stopped = result.stopped;
          state.done = list.length;
          break;
        }
      } catch (error) {
        state.failed.push(...batch);
        toast.error((error as Error).message);
      }
      state.done = Math.min(list.length, i + batch.length);
      setProgress({ ...state, failed: [...state.failed] });
    }

    state.finished = true;
    setProgress({ ...state, failed: [...state.failed] });

    try {
      await api("/api/admin/campaigns/log", {
        body: {
          campaign: data,
          stats: { recipients: list.length, sent: state.sent, failed: state.failed.length, failedEmails: state.failed.slice(0, 500) },
        },
      });
    } catch (error) {
      toast.error(`Sent, but the history record failed: ${(error as Error).message}`);
    }
    setTimeout(() => client.invalidateQueries({ queryKey: adminKeys.mailbox }), 2500);

    if (state.failed.length === 0) {
      toast.success(`Sent to ${state.sent} ${state.sent === 1 ? "person" : "people"}.`);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
    } else {
      toast.warning(`Sent to ${state.sent}; ${state.failed.length} didn't go out.`);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Email marketing"
        title="New campaign"
        description="Write it once and it goes out on CLVRY letterhead with a personal unsubscribe link. Your draft is kept in this browser until it's sent."
        actions={
          <Link href="/admin/campaigns" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            ← All campaigns
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Panel title="Message">
            <div className="flex flex-col gap-4">
              <Field label="Subject line">
                <TextInput value={campaign.subject} onChange={set("subject")} maxLength={150} placeholder="Drop 001 is live" />
              </Field>
              <Field label="Preview text" hint="The grey line inboxes show after the subject.">
                <TextInput value={campaign.preheader} onChange={set("preheader")} maxLength={150} placeholder="First pieces, first come." />
              </Field>
              <Field label="Heading">
                <TextInput value={campaign.heading} onChange={set("heading")} maxLength={120} placeholder="Christ above all" />
              </Field>
              <Field
                label="Message"
                hint={
                  <>
                    Leave a blank line between paragraphs. <code>**bold**</code> and <code>[link text](https://…)</code> work.
                  </>
                }
              >
                <TextArea value={campaign.body} onChange={set("body")} className="min-h-56" maxLength={10000} />
              </Field>
            </div>
          </Panel>

          <Panel title="Image and button" description="Both optional.">
            <div className="flex flex-col gap-4">
              <Field
                label="Header image"
                hint="A full https:// image link, or a path on this site like /explore/garment/polo-olive.webp (copy one from Gallery)."
              >
                <TextInput value={campaign.imageUrl} onChange={set("imageUrl")} placeholder="/explore/garment/clvry-caps.webp" />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Button text">
                  <TextInput value={campaign.ctaLabel} onChange={set("ctaLabel")} maxLength={40} placeholder="Shop the drop" />
                </Field>
                <Field label="Button link">
                  <TextInput value={campaign.ctaUrl} onChange={set("ctaUrl")} placeholder="/explore/garment" />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel title="Send">
            <div className="flex flex-col gap-5">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <Field label="Send a test to">
                  <TextInput
                    type="email"
                    value={testTo}
                    onChange={(e) => setTestTo(e.target.value)}
                    placeholder={status.data?.mail.inbox ?? "you@example.com"}
                  />
                </Field>
                <AdminButton variant="outline" onClick={sendTest} disabled={testing || sending}>
                  {testing && <Loader2Icon className="animate-spin" aria-hidden />}
                  Send test
                </AdminButton>
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-sm">
                  Audience: <strong>everyone active on the list</strong>{" "}
                  <span className="text-muted-foreground">
                    ({mailbox.isPending ? "counting…" : `${recipients.length} ${recipients.length === 1 ? "person" : "people"}`})
                  </span>
                </p>
                {recipients.length > GMAIL_DAILY_LIMIT && (
                  <p className="mt-2 flex gap-2 text-xs leading-relaxed text-gold">
                    <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    That&rsquo;s more than Gmail sends in a day (about {GMAIL_DAILY_LIMIT} on a regular account). If it stops part-way,
                    use &ldquo;Retry the rest&rdquo; tomorrow.
                  </p>
                )}
                <AdminButton className="mt-4 h-11 w-full" onClick={() => validated() && setConfirming(true)} disabled={sending || !recipients.length}>
                  <SendIcon aria-hidden />
                  Send to {recipients.length} {recipients.length === 1 ? "subscriber" : "subscribers"}
                </AdminButton>
              </div>

              {progress && (
                <div className="border border-border p-4" aria-live="polite">
                  <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span>{progress.finished ? "Finished" : "Sending…"}</span>
                    <span className="text-muted-foreground">
                      {progress.done} / {progress.total}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {progress.sent} sent{progress.failed.length ? `, ${progress.failed.length} not sent` : ""}.
                    {progress.stopped && ` ${progress.stopped}`}
                  </p>
                  {progress.finished && progress.failed.length > 0 && (
                    <AdminButton variant="outline" className="mt-3" onClick={() => sendTo(progress.failed)}>
                      Retry the rest ({progress.failed.length})
                    </AdminButton>
                  )}
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <Panel title="Preview" description={campaign.subject ? `Subject: ${campaign.subject}` : "How it looks in the inbox."}>
            <iframe
              title="Email preview"
              srcDoc={html}
              sandbox=""
              className="h-[75vh] w-full border border-border bg-[#f2ebdd]"
            />
          </Panel>
        </div>
      </div>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="rounded-none sm:max-w-md">
          <DialogTitle className="font-display text-xl font-normal uppercase">Send this campaign?</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            &ldquo;{campaign.subject}&rdquo; goes to {recipients.length} {recipients.length === 1 ? "person" : "people"} now. Sent emails
            can&rsquo;t be recalled, so send yourself a test first if you haven&rsquo;t.
          </DialogDescription>
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => sendTo(recipients)}>Send now</AdminButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
