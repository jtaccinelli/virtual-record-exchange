import { GetLoadContextArgs } from "@remix-run/cloudflare";

import { KVSession } from "./session";

export async function getLoadContext({ request, context }: GetLoadContextArgs) {
  const session = await KVSession.init(request, context);

  return {
    ...context,
    session,
  };
}
