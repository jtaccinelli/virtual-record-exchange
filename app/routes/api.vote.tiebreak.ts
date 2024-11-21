import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";

import { isNotFile, isString } from "@app/utils/data";

export async function action({ context, request }: ActionFunctionArgs) {
  const userId = context?.user?.id;
  if (!userId) throw redirect("/");

  const form = await request.formData();

  const playlistId = form.get("playlist-id");
  const contributorId = form.get("user-id");
  const trackId = form.get("track-id");

  const hasValidData =
    isString(playlistId) && isNotFile(contributorId) && isNotFile(trackId);

  if (!hasValidData) {
    throw new Error("Data for config creation was sent with incorrect format");
  }

  await context.db.insert(context.db.votes, {
    set: () => ({
      playlist_id: playlistId,
      voter_id: "tiebreak",
      contributor_ids: contributorId,
      track_ids: trackId,
    }),
  });

  throw redirect("/");
}
