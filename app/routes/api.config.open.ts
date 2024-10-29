import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { and, eq } from "drizzle-orm";

export async function action({ context, request }: ActionFunctionArgs) {
  if (!context.user) {
    console.error("User was not signed in");
    throw redirect("/");
  }

  const form = await request.formData();
  const playlistId = form.get("playlist-id");

  if (typeof playlistId !== "string") {
    throw Error("No playlist ID provided.");
  }

  await context.db.orm
    .update(context.db.configs)
    .set({ enable_voting: 1 })
    .where(
      and(
        eq(context.db.configs.playlist_id, playlistId),
        eq(context.db.configs.created_by, context.user.id),
      ),
    );

  throw redirect(`/results/${playlistId}`);
}
