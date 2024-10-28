import { GetLoadContextArgs } from "@remix-run/cloudflare";

import { KVSession } from "./session";
import { SpotifyAuth } from "./auth";
import { SpotifyClient } from "./spotify";
import { Database } from "./database";

import { config } from "../config";

export async function getLoadContext({ request, context }: GetLoadContextArgs) {
  const session = await KVSession.init(request, context);
  const auth = await SpotifyAuth.init(request, session);
  const spotify = await SpotifyClient.init(auth);
  const db = await Database.init(context);

  type UserProfile = SpotifyApi.CurrentUsersProfileResponse;
  const user = await spotify.fetch<UserProfile>(config.spotify.endpoints.me);

  return {
    ...context,
    user,
    spotify,
    session,
    auth,
    db,
  };
}
