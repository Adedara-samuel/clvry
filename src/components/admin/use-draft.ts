"use client";

import { useState } from "react";

/**
 * Local edits on top of server data: `value` is the draft once anything changes, otherwise the
 * server copy, so a refetch never clobbers work in progress and discarding is just dropping the draft.
 */
export function useDraft<T>(server: T | undefined) {
  const [draft, setDraft] = useState<T | null>(null);
  const value = draft ?? server;
  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(server);
  return {
    value,
    dirty,
    update: (fn: (current: T) => T) => setDraft((d) => fn((d ?? server) as T)),
    reset: () => setDraft(null),
  };
}

/** Immutable array helpers for list editors. */
export function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function replaceAt<T>(list: T[], index: number, item: T) {
  return list.map((x, i) => (i === index ? item : x));
}

export function removeAt<T>(list: T[], index: number) {
  return list.filter((_, i) => i !== index);
}
