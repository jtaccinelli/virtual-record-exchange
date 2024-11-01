import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { config } from "config";
import { eq } from "drizzle-orm";
import { DialogDeleteForm } from "@app/components/dialog-delete-form";
import { HeaderResults } from "@app/components/header-results";
import { DialogReopenVoting } from "@app/components/dialog-reopen-voting";
import { ActionBar } from "@app/components/action-bar";
import { ResultsList } from "@app/components/results-list";
import { ResultsBar } from "@app/components/results-bar";
import { useMemo } from "react";
import {
  processBestTrackResults,
  processBestUserResults,
  processMostTrackVotesResults,
} from "@app/utils/results";
import { ResultsPie } from "@app/components/results-pie";

// 6wVtemFdsmYio00dj7cojJ

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.id || !context.user) throw redirect("/");

  type Response = SpotifyApi.PlaylistObjectFull;
  const playlist = await context.spotify.fetch<Response>(
    config.spotify.endpoints.playlists + `/${params.id}`,
  );

  if (!playlist) throw redirect("/");

  const [form] = await context.db.orm
    .select()
    .from(context.db.configs)
    .where(eq(context.db.configs.playlist_id, params.id))
    .limit(1);

  if (!form) throw redirect(`/`);
  if (form.enable_voting) throw redirect(`/vote/${params.id}`);

  const isFormCreator = form.created_by === context.user.id;

  const votes = await context.db.orm
    .select()
    .from(context.db.votes)
    .where(eq(context.db.votes.playlist_id, params.id));

  const tracks = playlist.tracks.items.map((item) => {
    if (!item.track) return undefined;
    return { ...item.track, added_by: item.added_by };
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
    votes,
    users: users.filter((user) => !!user),
    tracks: tracks.filter((track) => !!track),
    isFormCreator,
  };
}

export default function Page() {
  const { playlist, votes, tracks, users, isFormCreator } =
    useLoaderData<typeof loader>();

  const data = useMemo(() => {
    const bestTrackVote = processBestTrackResults(votes, tracks);
    const bestUserVote = processBestUserResults(votes, users);
    const mostTrackVotes = processMostTrackVotesResults(votes, users, tracks);

    return {
      bestTrackVote,
      bestUserVote,
      mostTrackVotes,
    };
  }, []);

  const bestContributorData = useMemo(() => {
    return processBestTrackResults(votes, tracks);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <HeaderResults playlist={playlist} />
      {!isFormCreator ? null : (
        <ActionBar
          message="You created this form."
          actions={[
            <DialogReopenVoting
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
      <div className="flex flex-col divide-y divide-gray-800">
        <ResultsBar label="Best Track" data={data.bestTrackVote} />
        <ResultsBar label="Most Track Votes" data={data.mostTrackVotes} />
        <ResultsPie label="Best Contributor" data={data.bestUserVote} />
        <ResultsList
          label="Honourable Mentions"
          votes={votes}
          map={(vote) => vote.honourable_mentions}
        />
        <ResultsList
          label="Shame Votes"
          votes={votes}
          map={(vote) => vote.shame_votes}
        />
      </div>
    </div>
  );
}
