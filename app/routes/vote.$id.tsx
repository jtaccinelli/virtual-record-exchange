import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { fetchPlaylist, fetchUsersFromPlaylist } from "@app/utils/data";

import { DialogCantVote } from "@app/components/dialog-cant-vote";
import { DialogDeleteForm } from "@app/components/dialog-delete-form";
import { DialogCloseVoting } from "@app/components/dialog-close-voting";

import { HeaderVote } from "@app/components/header-vote";
import { ActionBar } from "@app/components/action-bar";
import { FormVote } from "@app/components/form-vote";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const userId = context.user?.id;
  const playlistId = params.id;

  if (!playlistId || !userId) throw redirect("/");

  const playlist = await fetchPlaylist(context, playlistId);

  if (!playlist) throw redirect("/");

  const [config] = await context.db.select(context.db.configs, {
    where: (table) => eq(table.playlist_id, playlistId),
  });

  const votes = await context.db.select(context.db.votes, {
    where: (table) => eq(table.playlist_id, playlistId),
  });

  if (!config) throw redirect(`/`);
  if (!config.enable_voting) throw redirect(`/results/${params.id}`);

  const users = await fetchUsersFromPlaylist(context, playlist);
  const hasContributed = users.some((user) => user.id === userId);
  const hasCreated = config.created_by === userId;

  return {
    playlist,
    users,
    config,
    votes,
    hasContributed,
    hasCreated,
  };
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  if (!data.hasContributed) {
    return <DialogCantVote />;
  }

  const { playlist, users, config, votes, hasCreated } = data;

  return (
    <div className="flex flex-col">
      <HeaderVote playlist={playlist} users={users} votes={votes} />
      {!hasCreated ? null : (
        <ActionBar
          message="You created this form."
          actions={[
            <DialogCloseVoting
              playlist={playlist}
              className="text whitespace-nowrap px-3 py-2 text-left"
            />,
            <DialogDeleteForm
              playlist={playlist}
              className="text whitespace-nowrap px-3 py-2 text-left"
            />,
          ]}
        />
      )}
      <FormVote config={config} playlist={playlist} users={users} />
    </div>
  );
}
