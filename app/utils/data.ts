import { AppLoadContext } from "@remix-run/cloudflare";

import { config } from "config";

export async function fetchPlaylist(context: AppLoadContext, id: string) {
  return await context.spotify.fetch<Playlist>(
    config.spotify.endpoints.playlists + `/${id}`,
  );
}

export async function fetchUser(context: AppLoadContext, id: string) {
  return await context.spotify.fetch<User>(
    config.spotify.endpoints.users + `/${id}`,
  );
}

export async function fetchUsersFromPlaylist(
  context: AppLoadContext,
  playlist: Playlist,
) {
  const tracks = playlist.tracks.items;
  const [...ids] = new Set(tracks.map((item) => item.added_by.id));
  const users = await Promise.all(ids.map((id) => fetchUser(context, id)));
  return users.filter((user) => !!user);
}

export function isNotFile(
  value: FormDataEntryValue | null,
): value is string | null {
  return typeof value !== "object";
}

export function isString(value: FormDataEntryValue | null): value is string {
  return typeof value === "string";
}
