import { AppLoadContext } from "@remix-run/cloudflare";

import { config } from "config";

export async function fetchPlaylist(context: AppLoadContext, id: string) {
  return await context.spotify.fetch<Playlist>(
    config.spotify.endpoints.playlists + `/${id}`,
  );
}
