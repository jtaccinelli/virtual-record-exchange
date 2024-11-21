import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";

import { isString } from "@app/utils/data";

export async function action({ context, request }: ActionFunctionArgs) {
  const userId = context?.user?.id;
  if (!userId) throw redirect("/");

  const form = await request.formData();

  const playlistId = form.get("playlist-id");
  const contributorIds = form.get("contributor-ids");
  const contributorVoteCount = form.get("contributor-vote-count");
  const trackVoteCount = form.get("track-vote-count");

  const hasValidData =
    isString(playlistId) &&
    isString(contributorIds) &&
    isString(trackVoteCount) &&
    isString(contributorVoteCount);

  if (!hasValidData) {
    throw new Error("Data for config creation was sent with incorrect format");
  }

  await context.db.insert(context.db.configs, {
    set: () => ({
      playlist_id: playlistId,
      created_by: userId,
      contributor_ids: contributorIds,
      contributor_vote_count: parseInt(contributorVoteCount),
      track_vote_count: parseInt(trackVoteCount),
      enable_honourable_mentions: 1,
      enable_shame_votes: 1,
      enable_voting: 1,
    }),
  });

  throw redirect("/vote/" + playlistId);
}
