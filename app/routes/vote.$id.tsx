import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

import { config } from "config";
import { HeaderVote } from "@app/components/header-vote";
import { FormVote } from "@app/components/form-vote";
import { eq } from "drizzle-orm";
import { DialogRevoteForm } from "@app/components/dialog-revote-form";
import { DialogCantVote } from "@app/components/dialog-cant-vote";
import { DialogDeleteForm } from "@app/components/dialog-delete-form";
import { DialogCloseVoting } from "@app/components/dialog-close-voting";
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
  if (!form.enable_voting) throw redirect(`/results/${params.id}`);

  type Response = SpotifyApi.PlaylistObjectFull;
  const playlist = await context.spotify.fetch<Response>(
    config.spotify.endpoints.playlists + `/${params.id}`,
  );

  if (!playlist) throw redirect("/");

  const [...userIds] = new Set(
    playlist.tracks.items.map((item) => {
      return item.added_by.id;
    }),
  );

  const users = await Promise.all(
    userIds.map((id) => {
      type Response = SpotifyApi.UserProfileResponse;
      return context.spotify.fetch<Response>(
        config.spotify.endpoints.users + `/${id}`,
      );
    }),
  );

  const tracks = playlist.tracks.items
    .filter((item) => {
      return context.user?.id !== item.added_by.id;
    })
    .map((item) => {
      return item.track;
    });

  const votes = await context.db.orm
    .select()
    .from(context.db.votes)
    .where(eq(context.db.votes.playlist_id, params.id));

  const previousVote = votes.find((vote) => {
    return vote.voter_id === context?.user?.id;
  });

  const hasNotContributed = !userIds.some((id) => id === context?.user?.id);
  const isFormCreator = form.created_by === context.user.id;

  return {
    playlist,
    users: users
      .filter((user) => !!user)
      .filter((user) => user.id !== context?.user?.id),
    contributors: users.filter((user) => !!user),
    tracks: tracks.filter((track) => !!track),
    config: form,
    votes,
    previousVote,
    hasNotContributed,
    isFormCreator,
  };
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  if (data.hasNotContributed) {
    return <DialogCantVote />;
  }

  const {
    playlist,
    users,
    contributors,
    tracks,
    config,
    votes,
    previousVote,
    isFormCreator,
  } = data;

  return (
    <div className="flex flex-col">
      <HeaderVote
        playlist={playlist}
        contributors={contributors}
        votes={votes}
      />
      {!isFormCreator ? null : (
        <ActionBar
          message="You created this form."
          actions={[
            <DialogCloseVoting playlist={playlist} className="link" />,
            <DialogDeleteForm playlist={playlist} className="link" />,
          ]}
        />
      )}

      <FormVote
        tracks={tracks}
        users={users}
        playlist={playlist}
        config={config}
      />
      <DialogRevoteForm vote={previousVote} playlist={playlist} />
    </div>
  );
}
