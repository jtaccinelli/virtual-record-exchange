import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { eq, like, or } from "drizzle-orm";

import { HeaderHome } from "@app/components/header-list";
import { ListPlaylists } from "@app/components/list-playlists";

import { config } from "config";

export async function loader({ context }: LoaderFunctionArgs) {
  if (!context?.user?.id) return {};

  const configs = await context.db.orm
    .select()
    .from(context.db.configs)
    .where(
      or(
        like(context.db.configs.contributor_ids, `%${context.user.id}%`),
        eq(context.db.configs.created_by, context.user.id),
      ),
    );

  const votes = await context.db.orm
    .select()
    .from(context.db.votes)
    .where(eq(context.db.votes.voter_id, context.user.id));

  const playlists = await Promise.all(
    configs.map((item) => {
      type Response = SpotifyApi.PlaylistObjectFull;
      return context.spotify.fetch<Response>(
        config.spotify.endpoints.playlists + `/${item.playlist_id}`,
      );
    }),
  );

  const enrichedPlaylists = playlists.reduce((array, playlist) => {
    if (!playlist) return array;

    const config = configs.find((config) => config.playlist_id === playlist.id);
    const vote = votes.find((vote) => vote.playlist_id === playlist.id);
    if (!config) return array;

    array.push({
      data: playlist,
      isOpen: !!config.enable_voting,
      hasVoted: !!vote,
      hasCreated: config.created_by === context?.user?.id,
    });

    return array;
  }, [] as EnrichedPlaylist[]);

  return {
    playlists: enrichedPlaylists,
  };
}

export default function Index() {
  const { playlists } = useLoaderData<typeof loader>();

  if (typeof playlists === "undefined") return null;

  return (
    <div>
      <HeaderHome />
      <ListPlaylists
        title="Open Voting Forms"
        filter={(playlist) => playlist.isOpen}
        playlists={playlists}
      />
      <ListPlaylists
        title="Closed Voting Forms"
        playlists={playlists}
        filter={(playlist) => !playlist.isOpen}
      />
    </div>
  );
}
