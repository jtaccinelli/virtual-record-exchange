import { useLoaderData } from "@remix-run/react";
import {
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";

import {
  processBestTrackResults,
  processBestUserResults,
  processMostTrackVotesResults,
} from "@app/utils/results";
import { fetchPlaylist, fetchUsersFromPlaylist } from "@app/utils/data";

import { ActionBar } from "@app/components/action-bar";
import { DialogDeleteForm } from "@app/components/dialog-delete-form";
import { DialogReopenVoting } from "@app/components/dialog-reopen-voting";
import { HeaderResults } from "@app/components/header-results";
import { ResultsList } from "@app/components/results-list";
import { ResultsBar } from "@app/components/results-bar";
import { ResultsPie } from "@app/components/results-pie";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const userId = context.user?.id;
  const playlistId = params.id;

  if (!playlistId || !userId) throw redirect("/");

  const playlist = await fetchPlaylist(context, playlistId);

  if (!playlist) throw redirect("/");

  const [config] = await context.db.select(context.db.configs, {
    where: (table) => eq(table.playlist_id, playlistId),
  });

  const votes = await context.db.select(context.db.votes, {
    where: (table) => eq(table.playlist_id, playlistId),
  });

  if (!config) throw redirect(`/`);
  if (config.enable_voting) throw redirect(`/vote/${params.id}`);

  const users = await fetchUsersFromPlaylist(context, playlist);

  const tracks = playlist.tracks.items
    .map((item) =>
      item.track ? { ...item.track, added_by: item.added_by } : null,
    )
    .filter((track) => !!track);

  const bestTrackVote = processBestTrackResults(votes, tracks);
  const bestUserVote = processBestUserResults(votes, users);
  const mostTrackVotes = processMostTrackVotesResults(votes, users, tracks);

  const hasCreated = config.created_by === userId;

  return {
    playlist,
    votes,
    data: {
      bestTrackVote,
      bestUserVote,
      mostTrackVotes,
    },
    hasCreated,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  const { playlist } = data;

  return [
    {
      title: `Result for "${playlist.name}"`,
    },
    {
      property: "og:image",
      content: playlist.images[0].url,
    },
  ];
};

export default function Page() {
  const { playlist, votes, data, hasCreated } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3">
      <HeaderResults playlist={playlist} />
      {!hasCreated ? null : (
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
