import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { config } from "config";
import { eq } from "drizzle-orm";
import { DialogDeleteForm } from "@app/components/dialog-delete-form";
import { HeaderResults } from "@app/components/header-results";
import { DialogReopenVoting } from "@app/components/dialog-reopen-voting";
import { ActionBar } from "@app/components/action-bar";

// 6wVtemFdsmYio00dj7cojJ

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.id || !context.user) throw redirect("/");

  const [form] = await context.db.orm
    .select()
    .from(context.db.configs)
    .where(eq(context.db.configs.playlist_id, params.id))
    .limit(1);

  if (!form) throw redirect(`/`);
  if (form.enable_voting) throw redirect(`/vote/${params.id}`);

  type Response = SpotifyApi.PlaylistObjectFull;
  const playlist = await context.spotify.fetch<Response>(
    config.spotify.endpoints.playlists + `/${params.id}`,
  );

  if (!playlist) throw redirect("/");

  const votes = await context.db.orm
    .select()
    .from(context.db.votes)
    .where(eq(context.db.votes.playlist_id, params.id));

  const previousVote = votes.find((vote) => {
    return vote.voter_id === context?.user?.id;
  });

  const isFormCreator = form.created_by === context.user.id;

  return {
    playlist,
    config: form,
    votes,
    previousVote,
    isFormCreator,
  };
}

export default function Page() {
  const { playlist, isFormCreator } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3">
      <HeaderResults playlist={playlist} />
      {!isFormCreator ? null : (
        <ActionBar
          message="You created this form."
          actions={[
            <DialogReopenVoting playlist={playlist} className="link" />,
            <DialogDeleteForm playlist={playlist} className="link" />,
          ]}
        />
      )}
    </div>
  );
}
