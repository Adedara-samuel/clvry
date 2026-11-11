export const platforms = ["Spotify", "Audiomack"] as const;
export type Platform = (typeof platforms)[number];

export type Playlist = { title: string; note: string; links: Partial<Record<Platform, string>> };

/*
 * Playlists shown under Music on /explore/events. Paste a playlist's share URL under `links` when it
 * goes live (e.g. links: { Spotify: "https://open.spotify.com/playlist/…" }); until then that
 * platform's button reads "Coming soon".
 */
export const playlists: Playlist[] = [
  { title: "Worship on the Decks", note: "Praise with a street sound.", links: {} },
  { title: "Sunday Morning", note: "Slow and warm, for the drive to church.", links: {} },
  { title: "Late Night Prayer", note: "Low lights, quiet hearts.", links: {} },
];
