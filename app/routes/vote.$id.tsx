import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { config } from "config";
import { HeaderVote } from "@app/components/header-vote";
import { FormVote } from "@app/components/form-vote";
import { eq } from "drizzle-orm";

// 6wVtemFdsmYio00dj7cojJ

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.id || !context.user) throw redirect("/");

  type Response = SpotifyApi.PlaylistObjectFull;
  const playlist = await context.spotify.fetch<Response>(
    config.spotify.endpoints.playlists + `/${params.id}`,
  );

  if (!playlist) throw redirect("/");

  const tracks = playlist.tracks.items
    .filter((item) => {
      return context.user?.id !== item.added_by.id;
    })
    .map((item) => {
      return item.track;
    });

  const [...userIds] = new Set(
    playlist.tracks.items
      .map((item) => {
        return item.added_by.id;
      })
      .filter((id) => {
        return context.user?.id !== id;
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

  const formConfig = await context.db.orm
    .select()
    .from(context.db.configs)
    .where(eq(context.db.configs.playlist_id, params.id));

  return {
    playlist,
    users: users.filter((user) => !!user),
    tracks: tracks.filter((track) => !!track),
    config: formConfig,
  };
}

export default function Page() {
  const { playlist, users, tracks, config } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3">
      <HeaderVote playlist={playlist} users={users} />
      <FormVote tracks={tracks} users={users} playlist={playlist} />
    </div>
  );
}
