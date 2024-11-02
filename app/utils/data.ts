import { AppLoadContext } from "@remix-run/cloudflare";

import { config } from "config";

export async function fetchPlaylist(context: AppLoadContext, id: string) {
  return await context.spotify.fetch<Playlist>(
    config.spotify.endpoints.playlists + `/${id}`,
  );
}

export function isNotFile(
  value: FormDataEntryValue | null,
): value is string | null {
  return typeof value !== "object";
}

export function isString(value: FormDataEntryValue | null): value is string {
  return typeof value === "string";
}
