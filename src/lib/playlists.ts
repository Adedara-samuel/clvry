import content from "@/content/playlists.json";
import { playlistPlatforms, type PlaylistsContent } from "./content-schema";

export const platforms = playlistPlatforms;
export type Platform = (typeof platforms)[number];

export type Playlist = PlaylistsContent[number];

/*
 * Playlists shown under Music on /explore/events, from src/content/playlists.json (edited at
 * /admin/content). A platform without a link reads "Coming soon".
 */
export const playlists: Playlist[] = content as PlaylistsContent;
