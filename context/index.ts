import { GetLoadContextArgs } from "@remix-run/cloudflare";

import { KVSession } from "./session";
import { SpotifyAuth } from "./auth";
import { SpotifyClient } from "./spotify";

export async function getLoadContext({ request, context }: GetLoadContextArgs) {
  const session = await KVSession.init(request, context);
  const auth = await SpotifyAuth.init(request, session);
  const spotify = await SpotifyClient.init(auth);

  return {
    ...context,
    spotify,
    session,
    auth,
  };
}
