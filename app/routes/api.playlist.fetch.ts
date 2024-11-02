import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";

import { fetchPlaylist } from "@app/utils/data";

const FALLBACK_VALUE = {
  playlist: undefined,
  hasConfig: false,
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("id");
  if (!playlistId) return FALLBACK_VALUE;

  const playlist = await fetchPlaylist(context, playlistId);
  if (!playlist?.id) return FALLBACK_VALUE;

  const config = await context.db.select(context.db.configs, {
    where: (table) => eq(table.playlist_id, playlist.id),
  });

  return {
    playlist,
    hasConfig: config.length > 0,
  };
}
