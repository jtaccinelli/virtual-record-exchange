import { GetLoadContextArgs } from "@remix-run/cloudflare";

import { KVSession } from "./session";
import { SpotifyAuth } from "./auth";
import { SpotifyClient } from "./spotify";
import { Database } from "./database";

export async function getLoadContext({ request, context }: GetLoadContextArgs) {
  const session = await KVSession.init(request, context);
  const auth = await SpotifyAuth.init(request, session);
  const spotify = await SpotifyClient.init(auth);
  const db = await Database.init(context);

  return {
    ...context,
    spotify,
    session,
    auth,
    db,
  };
}
