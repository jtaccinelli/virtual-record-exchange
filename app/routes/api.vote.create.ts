import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";

export async function action({ context, request }: ActionFunctionArgs) {
  if (!context.user) {
    console.error("User was not signed in");
    throw redirect("/");
  }

  const form = await request.formData();

  const playlistId = form.get("playlist-id");
  const contributorIds = form.get("user-ids");
  const trackIds = form.get("track-ids");
  const honourableMentions = form.get("honourable-mentions");
  const shameVotes = form.get("shame-votes");

  if (
    typeof playlistId !== "string" ||
    typeof contributorIds !== "string" ||
    typeof trackIds !== "string"
  ) {
    throw new Error("Data for config creation was sent with incorrect format");
  }

  if (!playlistId) {
    console.error("No playlist ID provided:");
    throw redirect("/");
  }

  await context.db.orm.insert(context.db.votes).values({
    playlist_id: playlistId,
    voter_id: context.user.id,
    contributor_ids: contributorIds,
    track_ids: trackIds,
    honourable_mentions: honourableMentions,
    shame_votes: shameVotes,
  });

  throw redirect("/");
}
