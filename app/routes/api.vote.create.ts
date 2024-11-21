import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";

import { isNotFile, isString } from "@app/utils/data";

export async function action({ context, request }: ActionFunctionArgs) {
  const userId = context?.user?.id;
  if (!userId) throw redirect("/");

  const form = await request.formData();

  const playlistId = form.get("playlist-id");
  const contributorIds = form.get("user-ids");
  const trackIds = form.get("track-ids");
  const honourableMentions = form.get("honourable-mentions");
  const shameVotes = form.get("shame-votes");
  const voterId = form.get("voter-id") ?? userId;

  const hasValidData =
    isString(playlistId) &&
    isNotFile(contributorIds) &&
    isNotFile(trackIds) &&
    isNotFile(honourableMentions) &&
    isNotFile(voterId) &&
    isNotFile(shameVotes);

  if (!hasValidData) {
    throw new Error("Data for config creation was sent with incorrect format");
  }

  await context.db.insert(context.db.votes, {
    set: () => ({
      playlist_id: playlistId,
      voter_id: voterId,
      contributor_ids: contributorIds,
      track_ids: trackIds,
      honourable_mentions: honourableMentions,
      shame_votes: shameVotes,
    }),
  });

  throw redirect("/");
}
