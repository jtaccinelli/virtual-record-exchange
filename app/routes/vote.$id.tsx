import { ComboboxUsers } from "@app/components/combobox-users";
import { SpotifyImage } from "@app/components/spotify-image";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { config } from "config";

// 6wVtemFdsmYio00dj7cojJ

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.id) throw redirect("/");

  type Response = SpotifyApi.PlaylistObjectFull;
  const playlist = await context.spotify.fetch<Response>(
    config.spotify.endpoints.playlists + `/${params.id}`,
  );

  if (!playlist) throw redirect("/");

  const tracks = playlist.tracks.items.map((item) => {
    return {
      title: item.track?.name,
    };
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

  return { playlist, users: users.filter((user) => !!user), tracks };
}

export default function Page() {
  const { playlist, users, tracks } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3 px-3">
      <div className="flex flex-col rounded bg-gray-900 p-6 pt-14">
        <h3 className="mb-1 text-2xl font-bold">{playlist.name}</h3>
        <p className="mb-2 text-sm text-gray-500">Playlist Voting Form</p>
        <div className="flex items-center gap-2">
          <div className="flex">
            {users.slice(3).map((user) => {
              return (
                <SpotifyImage
                  image={user?.images?.[0]}
                  className="-ml-2 size-8 rounded-full border-2 border-gray-800 first:ml-0"
                />
              );
            })}
            {users.length < 4 ? null : (
              <p className="-ml-2 flex size-8 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-gray-500">
                +{users.length - 4}
              </p>
            )}
          </div>
        </div>
      </div>
      <form className="flex flex-col bg-gray-900 p-6">
        <ComboboxUsers users={users} />
      </form>
    </div>
  );

  return <p>Vote Form</p>;
}
