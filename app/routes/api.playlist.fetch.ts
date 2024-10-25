import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { config } from "config";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("id");
  if (!playlistId) return { playlist: undefined };

  type Response = SpotifyApi.PlaylistObjectFull;
  const playlist = await context.spotify.fetch<Response>(
    config.spotify.endpoints.playlists + `/${playlistId}`,
  );

  return { playlist };
}
