import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { config } from "config";

export async function action({ context, request }: ActionFunctionArgs) {
  const form = await request.formData();

  const playlistId = form.get("playlist-id");
  const contributorIds = form.get("contributor-ids");
  const contributorVoteCount = form.get("contributor-vote-count");
  const trackVoteCount = form.get("track-vote-count");

  console.log(playlistId, contributorIds, contributorVoteCount, trackVoteCount);

  if (
    typeof playlistId !== "string" ||
    typeof contributorIds !== "string" ||
    typeof contributorVoteCount !== "string" ||
    typeof trackVoteCount !== "string"
  ) {
    throw new Error("Data for config creation was sent with incorrect format");
  }

  if (!playlistId) {
    console.error("No playlist ID provided:");
    throw redirect("/");
  }

  type Response = SpotifyApi.CurrentUsersProfileResponse;
  const user = await context.spotify.fetch<Response>(
    config.spotify.endpoints.me,
  );

  if (!user) {
    console.error("User was not signed in");
    throw redirect("/");
  }

  await context.db.orm.insert(context.db.configs).values({
    playlist_id: playlistId,
    created_by: user.id,
    contributor_ids: contributorIds,
    contributor_vote_count: parseInt(contributorVoteCount),
    track_vote_count: parseInt(trackVoteCount),
    enable_honourable_mentions: 1,
    enable_shame_votes: 1,
    enable_voting: 1,
  });

  throw redirect("/vote/" + playlistId);
}
