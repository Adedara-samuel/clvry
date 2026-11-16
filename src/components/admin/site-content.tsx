"use client";

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { playlistPlatforms, type PlaylistsContent, type SiteContent } from "@/lib/content-schema";
import { cn } from "@/lib/utils";
import { useContent, useSaveContent } from "./api";
import { AdminButton, ErrorNote, Field, Loading, PageHeader, Panel, SaveBar, TextArea, TextInput, Toggle } from "./ui";
import { move, removeAt, replaceAt, useDraft } from "./use-draft";

const tabs = ["Popup", "Scripture ticker", "Socials", "Playlists"] as const;
type Tab = (typeof tabs)[number];

function RowTools({ index, count, onMove, onRemove }: { index: number; count: number; onMove: (to: number) => void; onRemove?: () => void }) {
  return (
    <div className="flex shrink-0 gap-1">
      <AdminButton variant="ghost" className="h-8 px-2" aria-label="Move up" disabled={index === 0} onClick={() => onMove(index - 1)}>
        <ArrowUpIcon aria-hidden />
      </AdminButton>
      <AdminButton variant="ghost" className="h-8 px-2" aria-label="Move down" disabled={index === count - 1} onClick={() => onMove(index + 1)}>
        <ArrowDownIcon aria-hidden />
      </AdminButton>
      {onRemove && (
        <AdminButton variant="ghost" className="h-8 px-2 text-destructive" aria-label="Remove" onClick={onRemove}>
          <Trash2Icon aria-hidden />
        </AdminButton>
      )}
    </div>
  );
}

function Row({ children, tools }: { children: ReactNode; tools: ReactNode }) {
  return (
    <li className="flex flex-col gap-3 border-b border-border py-4 first:pt-0 last:border-b-0 md:flex-row md:items-start">
      <div className="grid flex-1 gap-3">{children}</div>
      {tools}
    </li>
  );
}

export function SiteContentEditor() {
  const [tab, setTab] = useState<Tab>("Popup");
  const site = useContent("site");
  const playlists = useContent("playlists");
  const saveSite = useSaveContent("site");
  const savePlaylists = useSaveContent("playlists");
  const siteDraft = useDraft<SiteContent>(site.data?.data);
  const listDraft = useDraft<PlaylistsContent>(playlists.data?.data);

  const saving = saveSite.isPending || savePlaylists.isPending;
  async function save() {
    if (siteDraft.dirty && siteDraft.value) await saveSite.mutateAsync(siteDraft.value).then(siteDraft.reset).catch(() => {});
    if (listDraft.dirty && listDraft.value) await savePlaylists.mutateAsync(listDraft.value).then(listDraft.reset).catch(() => {});
  }

  const error = site.error ?? playlists.error;
  const s = siteDraft.value;
  const p = listDraft.value;
  const setSite = siteDraft.update;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Content"
        title="Site content"
        description="The member popup, the scripture ticker on the home page, social links and the playlists under Music."
      />

      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 font-mono text-[10px] whitespace-nowrap uppercase tracking-[0.2em] transition-colors",
              tab === t ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {error ? (
        <ErrorNote error={error} onRetry={() => (site.refetch(), playlists.refetch())} />
      ) : !s || !p ? (
        <Loading />
      ) : tab === "Popup" ? (
        <Panel title="Become a member popup" description="Opens on its own after the delay; Subscribe buttons always open it.">
          <div className="grid gap-5">
            <div className="flex items-center gap-3">
              <Toggle
                label="Open automatically"
                checked={s.popup.enabled}
                onChange={(enabled) => setSite((c) => ({ ...c, popup: { ...c.popup, enabled } }))}
              />
              <span className="text-sm">Open automatically</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Delay on the home page (seconds)" hint="5.5 lets the hero's opening finish first.">
                <TextInput
                  type="number"
                  min={0}
                  max={120}
                  step={0.5}
                  value={s.popup.delaySeconds}
                  onChange={(e) => setSite((c) => ({ ...c, popup: { ...c.popup, delaySeconds: Number(e.target.value) } }))}
                />
              </Field>
              <Field label="Comes back on Explore after (minutes)">
                <TextInput
                  type="number"
                  min={0.5}
                  max={120}
                  step={0.5}
                  value={s.popup.exploreRepeatMinutes}
                  onChange={(e) => setSite((c) => ({ ...c, popup: { ...c.popup, exploreRepeatMinutes: Number(e.target.value) } }))}
                />
              </Field>
            </div>
            <Field label="Title">
              <TextInput value={s.popup.title} maxLength={60} onChange={(e) => setSite((c) => ({ ...c, popup: { ...c.popup, title: e.target.value } }))} />
            </Field>
            <Field label="Line under the title">
              <TextInput
                value={s.popup.description}
                maxLength={160}
                onChange={(e) => setSite((c) => ({ ...c, popup: { ...c.popup, description: e.target.value } }))}
              />
            </Field>
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Perks (up to 6)</p>
              <ul>
                {s.popup.perks.map((perk, i) => (
                  <Row
                    key={i}
                    tools={
                      <RowTools
                        index={i}
                        count={s.popup.perks.length}
                        onMove={(to) => setSite((c) => ({ ...c, popup: { ...c.popup, perks: move(c.popup.perks, i, to) } }))}
                        onRemove={() => setSite((c) => ({ ...c, popup: { ...c.popup, perks: removeAt(c.popup.perks, i) } }))}
                      />
                    }
                  >
                    <TextInput
                      value={perk}
                      maxLength={80}
                      aria-label={`Perk ${i + 1}`}
                      onChange={(e) => setSite((c) => ({ ...c, popup: { ...c.popup, perks: replaceAt(c.popup.perks, i, e.target.value) } }))}
                    />
                  </Row>
                ))}
              </ul>
              <AdminButton
                variant="outline"
                className="mt-3"
                disabled={s.popup.perks.length >= 6}
                onClick={() => setSite((c) => ({ ...c, popup: { ...c.popup, perks: [...c.popup.perks, ""] } }))}
              >
                <PlusIcon aria-hidden /> Add perk
              </AdminButton>
            </div>
          </div>
        </Panel>
      ) : tab === "Scripture ticker" ? (
        <Panel title="Scripture ticker" description="The wine bar scrolling across the top of the home page. NKJV is added after each reference.">
          <ul>
            {s.ticker.map((verse, i) => (
              <Row
                key={i}
                tools={
                  <RowTools
                    index={i}
                    count={s.ticker.length}
                    onMove={(to) => setSite((c) => ({ ...c, ticker: move(c.ticker, i, to) }))}
                    onRemove={s.ticker.length > 1 ? () => setSite((c) => ({ ...c, ticker: removeAt(c.ticker, i) })) : undefined}
                  />
                }
              >
                <Field label="Reference">
                  <TextInput
                    value={verse.ref}
                    maxLength={40}
                    onChange={(e) => setSite((c) => ({ ...c, ticker: replaceAt(c.ticker, i, { ...verse, ref: e.target.value }) }))}
                  />
                </Field>
                <Field label="Verse">
                  <TextArea
                    value={verse.text}
                    maxLength={400}
                    className="min-h-16"
                    onChange={(e) => setSite((c) => ({ ...c, ticker: replaceAt(c.ticker, i, { ...verse, text: e.target.value }) }))}
                  />
                </Field>
              </Row>
            ))}
          </ul>
          <AdminButton variant="outline" className="mt-4" onClick={() => setSite((c) => ({ ...c, ticker: [...c.ticker, { ref: "", text: "" }] }))}>
            <PlusIcon aria-hidden /> Add verse
          </AdminButton>
        </Panel>
      ) : tab === "Socials" ? (
        <Panel title="Social links" description="Shown in the hero and the popup.">
          <ul>
            {s.socials.map((social, i) => (
              <Row
                key={social.name}
                tools={
                  <div className="flex items-center gap-2 md:pt-6">
                    <Toggle
                      label={`Show ${social.name}`}
                      checked={social.visible}
                      onChange={(visible) => setSite((c) => ({ ...c, socials: replaceAt(c.socials, i, { ...social, visible }) }))}
                    />
                    <span className="text-xs text-muted-foreground">Show</span>
                  </div>
                }
              >
                <p className="font-display text-sm uppercase tracking-[0.1em]">{social.name}</p>
                <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
                  <Field label="Handle">
                    <TextInput
                      value={social.handle}
                      onChange={(e) => setSite((c) => ({ ...c, socials: replaceAt(c.socials, i, { ...social, handle: e.target.value }) }))}
                    />
                  </Field>
                  <Field label="Link">
                    <TextInput
                      type="url"
                      value={social.href}
                      onChange={(e) => setSite((c) => ({ ...c, socials: replaceAt(c.socials, i, { ...social, href: e.target.value }) }))}
                    />
                  </Field>
                </div>
              </Row>
            ))}
          </ul>
        </Panel>
      ) : (
        <Panel title="Playlists" description="Under Music on /explore/events. A platform with no link shows “Coming soon”.">
          <ul>
            {p.map((list, i) => (
              <Row
                key={i}
                tools={
                  <RowTools
                    index={i}
                    count={p.length}
                    onMove={(to) => listDraft.update((c) => move(c, i, to))}
                    onRemove={() => listDraft.update((c) => removeAt(c, i))}
                  />
                }
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Title">
                    <TextInput value={list.title} maxLength={60} onChange={(e) => listDraft.update((c) => replaceAt(c, i, { ...list, title: e.target.value }))} />
                  </Field>
                  <Field label="Note">
                    <TextInput value={list.note} maxLength={120} onChange={(e) => listDraft.update((c) => replaceAt(c, i, { ...list, note: e.target.value }))} />
                  </Field>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {playlistPlatforms.map((platform) => (
                    <Field key={platform} label={`${platform} link`}>
                      <TextInput
                        type="url"
                        placeholder="Coming soon"
                        value={list.links[platform] ?? ""}
                        onChange={(e) => {
                          const links = { ...list.links };
                          if (e.target.value.trim()) links[platform] = e.target.value.trim();
                          else delete links[platform];
                          listDraft.update((c) => replaceAt(c, i, { ...list, links }));
                        }}
                      />
                    </Field>
                  ))}
                </div>
              </Row>
            ))}
          </ul>
          <AdminButton variant="outline" className="mt-4" onClick={() => listDraft.update((c) => [...c, { title: "", note: "", links: {} }])}>
            <PlusIcon aria-hidden /> Add playlist
          </AdminButton>
        </Panel>
      )}

      <SaveBar
        dirty={siteDraft.dirty || listDraft.dirty}
        saving={saving}
        onSave={save}
        onDiscard={() => (siteDraft.reset(), listDraft.reset())}
      />
    </div>
  );
}
