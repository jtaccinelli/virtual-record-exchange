import { HeaderHome } from "@app/components/header-list";
import { ListPlaylists } from "@app/components/list-playlists";

import {
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { config } from "config";

import { eq, like, or } from "drizzle-orm";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

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

  const playlists = await Promise.all(
    configs.map((item) => {
      type Response = SpotifyApi.PlaylistObjectFull;
      return context.spotify.fetch<Response>(
        config.spotify.endpoints.playlists + `/${item.playlist_id}`,
      );
    }),
  );

  const createdIds = configs
    .filter((item) => !!item)
    .filter((item) => {
      if (!context.user?.id) return true;
      return item.created_by == context.user.id;
    })
    .map((item) => item.playlist_id);

  const openIds = configs
    .filter((item) => !!item)
    .filter((item) => {
      if (!context.user?.id) return true;
      const isContributor = item.contributor_ids.includes(context.user.id);
      return isContributor && !!item.enable_voting;
    })
    .map((item) => item.playlist_id);

  const closedIds = configs
    .filter((item) => !!item)
    .filter((item) => {
      if (!context.user?.id) return true;
      const isContributor = item.contributor_ids.includes(context.user.id);
      return isContributor && !item.enable_voting;
    })
    .map((item) => item.playlist_id);

  return {
    playlists: playlists.filter((playlist) => !!playlist),
    createdIds,
    openIds,
    closedIds,
  };
}

export default function Index() {
  const { playlists, createdIds, openIds, closedIds } =
    useLoaderData<typeof loader>();

  if (typeof playlists === "undefined") return null;

  return (
    <div>
      <HeaderHome />
      <ListPlaylists
        title="Open Voting Forms"
        playlists={playlists}
        ids={openIds}
        hasVoteLink
      />
      <ListPlaylists
        title="Closed Voting Forms"
        playlists={playlists}
        ids={closedIds}
        hasResultsLink
      />
      <ListPlaylists
        playlists={playlists}
        ids={createdIds}
        title="Voting Forms You've Created"
      />
    </div>
  );
}
