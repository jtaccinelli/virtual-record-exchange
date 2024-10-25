import { SpotifyImage } from "./spotify-image";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
  users: SpotifyApi.UserProfileResponse[];
};

export function HeaderVote({ playlist, users }: Props) {
  return (
    <div className="flex flex-col border-b-2 border-gray-800 p-6 pt-20">
      <p className="mb-1 text-sm text-gray-500">Playlist Voting Form</p>
      <h3 className="mb-2 text-2xl font-bold">{playlist.name}</h3>

      <div className="flex items-center gap-2">
        <div className="flex">
          {users.slice(3).map((user) => {
            return (
              <SpotifyImage
                image={user?.images?.[0]}
                className="-ml-2 size-8 rounded-full border-2 border-gray-800 bg-gray-900 first:ml-0"
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
  );
}
