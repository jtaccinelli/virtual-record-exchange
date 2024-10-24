import { SerializeFrom } from "@remix-run/cloudflare";
import { useRouteLoaderData } from "@remix-run/react";

import { loader } from "@app/root";

export function useRootLoaderData() {
  return useRouteLoaderData("root") as SerializeFrom<typeof loader>;
}
