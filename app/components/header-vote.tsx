import { useMemo } from "react";
import { Link } from "@remix-run/react";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

import { votes } from "context/database";
import { SpotifyImage } from "./spotify-image";
import { useRootLoaderData } from "@app/hooks/use-root-loader";
import { DialogRevoteForm } from "./dialog-revote-form";

type Props = {
  playlist: Playlist;
  users: User[];
  votes: (typeof votes.$inferSelect)[];
};

export function HeaderVote({ playlist, users, votes }: Props) {
  const { user } = useRootLoaderData();

  const { pending, voted } = useMemo(() => {
    return users.reduce<{ pending: typeof users; voted: typeof users }>(
      (acc, user) => {
        const hasVoted = votes.some((vote) => vote.voter_id === user.id);
        if (hasVoted) acc.voted.push(user);
        else acc.pending.push(user);
        return acc;
      },
      {
        pending: [],
        voted: [],
      },
    );
  }, [users, votes]);

  const currentUserVote = useMemo(() => {
    return votes.find((vote) => vote.voter_id === user?.id);
  }, [user, votes]);

  return (
    <div className="flex w-full flex-col gap-6 p-6 pt-10">
      <Link to="/" className="flex items-center gap-2">
        <ArrowLeftIcon className="size-4" />
        <span className="link">Back to home page</span>
      </Link>
      <p className="text -mb-6 text-gray-400">Playlist Voting Form</p>
      <h3 className="heading">{playlist.name}</h3>
      <p className="text -mb-4 text-gray-400">
        {voted.length} of {users.length} votes submitted
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
      {!currentUserVote ? null : (
        <DialogRevoteForm vote={currentUserVote} playlist={playlist} />
      )}
    </div>
  );
}
