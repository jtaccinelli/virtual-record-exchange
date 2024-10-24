import { GetLoadContextArgs } from "@remix-run/cloudflare";

import { KVSession } from "./session";
import { SpotifyAuth } from "./auth";

export async function getLoadContext({ request, context }: GetLoadContextArgs) {
  const session = await KVSession.init(request, context);
  const auth = await SpotifyAuth.init(request, session);

  return {
    ...context,
    session,
    auth,
  };
}
