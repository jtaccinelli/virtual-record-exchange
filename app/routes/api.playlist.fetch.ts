import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { config } from "config";
import { eq } from "drizzle-orm";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("id");
  if (!playlistId) {
    return {
      playlist: undefined,
      hasConfig: false,
    };
  }

  type Response = SpotifyApi.PlaylistObjectFull;
  const playlist = await context.spotify.fetch<Response>(
    config.spotify.endpoints.playlists + `/${playlistId}`,
  );

  if (!playlist) {
    return {
      playlist: undefined,
      hasConfig: false,
    };
  }

  const formConfig = await context.db.orm
    .select()
    .from(context.db.configs)
    .where(eq(context.db.configs.playlist_id, playlist.id));

  return {
    playlist,
    hasConfig: formConfig.length > 0,
  };
}
