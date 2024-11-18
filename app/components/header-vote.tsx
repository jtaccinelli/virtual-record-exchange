import { useMemo } from "react";
import { Link } from "@remix-run/react";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/16/solid";

import { votes } from "context/database";
import { SpotifyImage } from "./spotify-image";
import { useRootLoaderData } from "@app/hooks/use-root-loader";
import { DialogRevoteForm } from "./dialog-revote-form";

type Props = {
  playlist: Playlist;
  users: User[];
  voter?: User;
  votes: (typeof votes.$inferSelect)[];
};

export function HeaderVote({ playlist, users, votes, voter }: Props) {
  const currentUserVote = useMemo(() => {
    return votes.find((vote) => vote.voter_id === voter?.id);
  }, [voter, votes]);

  const { as, pending, voted } = useMemo(() => {
    return users.reduce<{
      pending: User[];
      voted: User[];
      as?: User;
    }>(
      (acc, user) => {
        const isVoter = user.id === voter?.id;
        if (isVoter) {
          acc.as = user;
          return acc;
        }

        const hasVoted = votes.some((vote) => vote.voter_id === user.id);
        if (hasVoted) acc.voted.push(user);
        else acc.pending.push(user);
        return acc;
      },
      {
        as: undefined,
        pending: [],
        voted: [],
      },
    );
  }, [users, votes]);

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
      <div className="flex items-center gap-1 overflow-x-scroll pb-2">
        {!as ? null : (
          <SpotifyImage
            key={as.id}
            image={as?.images?.[0]}
            className="mr-2 size-8 rounded-full border-2 border-white bg-gray-700"
          />
        )}
        {voted.map((user) => {
          return (
            <div className="relative size-8 rounded-full border-2 border-gray-700 bg-gray-900">
              <SpotifyImage
                key={user.id}
                image={user?.images?.[0]}
                className="rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 size-3 rounded-full bg-white">
                <CheckIcon className="size-3 text-black" />
              </div>
            </div>
          );
        })}
        {pending.map((user) => {
          return (
            <SpotifyImage
              key={user.id}
              image={user?.images?.[0]}
              className="size-8 rounded-full border-2 border-gray-700 bg-gray-900"
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
