import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { and, eq } from "drizzle-orm";

export async function action({ context, request }: ActionFunctionArgs) {
  if (!context.user) {
    console.error("User was not signed in");
    throw redirect("/");
  }

  const form = await request.formData();

  const playlistId = form.get("playlist-id");
  const voteId = form.get("vote-id");

  if (typeof playlistId !== "string" || typeof voteId !== "string") {
    throw new Error("Data for config creation was sent with incorrect format");
  }

  if (!playlistId) {
    console.error("No playlist ID provided.");
    throw redirect("/");
  }

  await context.db.orm
    .delete(context.db.votes)
    .where(
      and(
        eq(context.db.votes.id, parseInt(voteId)),
        eq(context.db.votes.playlist_id, playlistId),
        eq(context.db.votes.voter_id, context.user.id),
      ),
    );

  throw redirect(`/vote/${playlistId}`);
}
