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
  type Response = SpotifyApi.CurrentUsersProfileResponse;
  const user = await context.spotify.fetch<Response>(
    config.spotify.endpoints.me,
  );

  if (!user) return {};

  const configs = await context.db.orm
    .select()
    .from(context.db.configs)
    .where(
      or(
        like(context.db.configs.contributor_ids, `%${user.id}%`),
        eq(context.db.configs.created_by, user.id),
      ),
    );

  const playlists = await Promise.all(
    configs.map((item) => {
      type Response = SpotifyApi.PlaylistObjectFull;
      console.log(item);
      return context.spotify.fetch<Response>(
        config.spotify.endpoints.playlists + `/${item.playlist_id}`,
      );
    }),
  );

  const createdIds = configs
    .filter((item) => {
      return item.created_by == user.id;
    })
    .map((item) => item.playlist_id);

  const openIds = configs
    .filter((item) => {
      return item.contributor_ids.includes(user.id) && !!item.enable_voting;
    })
    .map((item) => item.playlist_id);

  const closedIds = configs
    .filter((item) => {
      return item.contributor_ids.includes(user.id) && !item.enable_voting;
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

  if (!playlists) return null;

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
