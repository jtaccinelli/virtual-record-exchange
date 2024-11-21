import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { and, eq } from "drizzle-orm";

import { isString } from "@app/utils/data";

export async function action({ context, request }: ActionFunctionArgs) {
  const userId = context?.user?.id;
  if (!userId) throw redirect("/");

  const form = await request.formData();
  const playlistId = form.get("playlist-id");

  const hasValidData = isString(playlistId);
  if (!hasValidData) throw Error("No playlist ID provided.");

  await context.db.update(context.db.configs, {
    set: () => ({ enable_voting: 0 }),
    where: (table) =>
      and(eq(table.playlist_id, playlistId), eq(table.created_by, userId)),
  });

  throw redirect(`/results/${playlistId}`);
}
