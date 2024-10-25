import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { config } from "config";
import { HeaderVote } from "@app/components/header-vote";
import { FormVote } from "@app/components/form-vote";

// 6wVtemFdsmYio00dj7cojJ

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.id) throw redirect("/");

  type Response = SpotifyApi.PlaylistObjectFull;
  const playlist = await context.spotify.fetch<Response>(
    config.spotify.endpoints.playlists + `/${params.id}`,
  );

  if (!playlist) throw redirect("/");

  const tracks = playlist.tracks.items.map((item) => {
    return item.track;
  });

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

  return {
    playlist,
    users: users.filter((user) => !!user),
    tracks: tracks.filter((track) => !!track),
  };
}

export async function action({ request }: ActionFunctionArgs) {}

export default function Page() {
  const { playlist, users, tracks } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3">
      <HeaderVote playlist={playlist} users={users} />
      <FormVote tracks={tracks} users={users} />
    </div>
  );
}
