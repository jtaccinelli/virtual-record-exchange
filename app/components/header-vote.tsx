import { useMemo } from "react";
import { Link } from "@remix-run/react";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

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
    <div className="flex w-full flex-col gap-6 p-6 pt-10">
      <Link to="/" className="flex items-center gap-2">
        <ArrowLeftIcon className="size-4" />
        <span className="link">Back to home page</span>
      </Link>
      <p className="text -mb-6 text-gray-400">Playlist Voting Form</p>
      <h3 className="heading">{playlist.name}</h3>
      <p className="text -mb-4 text-gray-400">
        {voted.length} of {contributors.length} votes submitted
      </p>
      <div className="flex items-center gap-1 overflow-x-scroll">
        {voted.map((user) => {
          return (
            <SpotifyImage
              key={user.id}
              image={user?.images?.[0]}
              className="size-8 rounded-full border border-white bg-gray-700"
            />
          );
        })}
        {pending.map((user) => {
          return (
            <SpotifyImage
              key={user.id}
              image={user?.images?.[0]}
              className="size-8 rounded-full border border-gray-700 bg-gray-900"
            />
          );
        })}
      </div>
    </div>
  );
}
