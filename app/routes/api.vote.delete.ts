import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { and, eq } from "drizzle-orm";

import { isString } from "@app/utils/data";

export async function action({ context, request }: ActionFunctionArgs) {
  const userId = context?.user?.id;
  if (!userId) throw redirect("/");

  const form = await request.formData();

  const playlistId = form.get("playlist-id");
  const voteId = form.get("vote-id");

  const hasValidData = isString(playlistId) && isString(voteId);
  if (!hasValidData) {
    throw new Error("Data for config creation was sent with incorrect format");
  }

  await context.db.delete(context.db.votes, {
    where: (table) =>
      and(
        eq(table.id, parseInt(voteId)),
        eq(table.playlist_id, playlistId),
        eq(table.voter_id, userId),
      ),
  });

  throw redirect(`/vote/${playlistId}`);
}
