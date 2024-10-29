import { useMemo } from "react";
import { votes } from "context/database";
import { SpotifyImage } from "./spotify-image";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
  contributors: SpotifyApi.UserProfileResponse[];
  votes: (typeof votes.$inferSelect)[];
};

export function HeaderVote({ playlist, contributors, votes }: Props) {
  const { pending, voted } = useMemo(() => {
    return contributors.reduce(
      (acc, user) => {
        const hasVoted = votes.some((vote) => vote.voter_id === user.id);
        if (hasVoted) acc.voted.push(user);
        else acc.pending.push(user);
        return acc;
      },
      {
        pending: [] as typeof contributors,
        voted: [] as typeof contributors,
      },
    );
  }, [contributors, votes]);

  return (
    <div className="flex flex-col border-b-2 border-gray-800 p-4 pt-16">
      <p className="mb-1 text-sm text-gray-500">Playlist Voting Form</p>
      <h3 className="mb-4 text-xl font-bold">{playlist.name}</h3>
      <p className="mb-2 basis-full text-sm font-semibold text-gray-500">
        {voted.length} of {contributors.length} votes submitted
      </p>
      <div className="flex items-center gap-1 overflow-x-scroll">
        {voted.map((user) => {
          return (
            <SpotifyImage
              key={user.id}
              image={user?.images?.[0]}
              className="size-8 rounded-full border-2 border-primary-600 bg-gray-900 first:ml-0"
            />
          );
        })}
        {pending.map((user) => {
          return (
            <SpotifyImage
              key={user.id}
              image={user?.images?.[0]}
              className="size-8 rounded-full border-2 border-gray-800 bg-gray-900 first:ml-0"
            />
          );
        })}
      </div>
    </div>
  );
}
