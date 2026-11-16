import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { contentFiles, type ContentKey, type ContentOf } from "@/lib/content-schema";

/*
 * Where admin edits are saved. The site reads its content from src/content/*.json at build time, so:
 *
 * - github: with GITHUB_TOKEN + GITHUB_REPO set, every save is a commit to the repo. Vercel (or any
 *   host watching the branch) redeploys, and the change is live a minute or two later. Every edit is
 *   in git history and can be reverted there.
 * - local: in `next dev` without a token, saves write straight to the files on disk (hot reload shows
 *   them at once). Commit them yourself.
 */

export type StoreMode = "github" | "local" | "none";

type FileChange = { path: string; content: string | Buffer } | { path: string; delete: true };

function github() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error("GITHUB_REPO must look like owner/name.");
  return { token, repo, branch: process.env.GITHUB_BRANCH || "main" };
}

export function storeMode(): StoreMode {
  if (github()) return "github";
  return process.env.NODE_ENV === "development" ? "local" : "none";
}

async function gh<T>(url: string, init: RequestInit & { raw?: boolean } = {}): Promise<T> {
  const cfg = github()!;
  const res = await fetch(`https://api.github.com/repos/${cfg.repo}${url}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: init.raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const hint =
      res.status === 401 || res.status === 403
        ? " Check that GITHUB_TOKEN is valid and has Contents: read & write access to the repo."
        : res.status === 404
          ? " Check GITHUB_REPO and GITHUB_BRANCH, and that the token can see the repo."
          : "";
    throw new Error(`GitHub ${init.method ?? "GET"} ${url} failed (${res.status}).${hint} ${detail.slice(0, 200)}`);
  }
  return (init.raw ? await res.text() : await res.json()) as T;
}

function notConfigured(): never {
  throw new Error(
    "Saving isn't set up on this server. Add GITHUB_TOKEN and GITHUB_REPO to the environment variables (see README → Admin portal).",
  );
}

/** Reads a content file: the latest commit on the branch in github mode, so recent saves show before the redeploy. */
export async function readContent<K extends ContentKey>(key: K): Promise<ContentOf<K>> {
  const file = contentFiles[key];
  const mode = storeMode();
  let text: string;
  if (mode === "github") {
    const cfg = github()!;
    text = await gh<string>(`/contents/${file.path}?ref=${encodeURIComponent(cfg.branch)}`, { raw: true });
  } else {
    text = await fs.readFile(path.join(process.cwd(), file.path), "utf8");
  }
  return file.schema.parse(JSON.parse(text)) as ContentOf<K>;
}

export function serialize(data: unknown) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

/** Writes several files in one commit (or straight to disk locally). */
export async function commitChanges(changes: FileChange[], message: string) {
  const mode = storeMode();
  if (mode === "none") notConfigured();

  for (const change of changes) {
    // Admin writes are limited to content JSON and public images.
    if (!/^(src\/content\/[\w-]+\.json|public\/explore\/[a-z-]+\/[a-z0-9-]+\.(webp|jpe?g|png))$/.test(change.path)) {
      throw new Error(`Refusing to write ${change.path}`);
    }
  }

  if (mode === "local") {
    for (const change of changes) {
      const target = path.join(process.cwd(), change.path);
      if ("delete" in change) await fs.rm(target, { force: true });
      else {
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, change.content);
      }
    }
    return { mode, commit: null as string | null };
  }

  const cfg = github()!;
  // Retry once if someone else moved the branch between our read and write.
  for (let attempt = 0; ; attempt++) {
    const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${encodeURIComponent(cfg.branch)}`);
    const head = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);

    const tree = await Promise.all(
      changes.map(async (change) => {
        if ("delete" in change) return { path: change.path, mode: "100644", type: "blob", sha: null };
        if (typeof change.content === "string") return { path: change.path, mode: "100644", type: "blob", content: change.content };
        const blob = await gh<{ sha: string }>(`/git/blobs`, {
          method: "POST",
          body: JSON.stringify({ content: change.content.toString("base64"), encoding: "base64" }),
        });
        return { path: change.path, mode: "100644", type: "blob", sha: blob.sha };
      }),
    );

    const newTree = await gh<{ sha: string }>(`/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: head.tree.sha, tree }),
    });
    const commit = await gh<{ sha: string }>(`/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message: `${message}\n\nSaved from the CLVRY admin portal.`, tree: newTree.sha, parents: [ref.object.sha] }),
    });
    try {
      await gh(`/git/refs/heads/${encodeURIComponent(cfg.branch)}`, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });
      return { mode, commit: commit.sha };
    } catch (error) {
      if (attempt >= 1) throw error;
    }
  }
}

/** Validates and saves one content file. */
export async function saveContent<K extends ContentKey>(key: K, data: unknown, message: string) {
  const file = contentFiles[key];
  const parsed = file.schema.parse(data);
  return commitChanges([{ path: file.path, content: serialize(parsed) }], message);
}
