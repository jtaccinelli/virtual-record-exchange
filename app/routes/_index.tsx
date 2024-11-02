import { Suspense } from "react";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import { eq, like, or } from "drizzle-orm";

import { HeaderHome } from "@app/components/header-list";
import { ListPlaylists } from "@app/components/list-playlists";
import { fetchPlaylist } from "@app/utils/data";
import { Section } from "@app/components/section";

import { Placeholder } from "@app/components/placeholder";

export async function loader({ context }: LoaderFunctionArgs) {
  async function playlistPromise() {
    const userId = context?.user?.id;
    if (!userId) return [];

    const forms = await context.db.select(context.db.configs, {
      where: (table) =>
        or(
          like(table.contributor_ids, `%${userId}%`),
          eq(table.created_by, userId),
        ),
    });

    const votes = await context.db.select(context.db.votes, {
      where: (table) => eq(table.voter_id, userId),
    });

    const playlists = await Promise.all(
      forms.map((item) => fetchPlaylist(context, item.playlist_id)),
    );

    const enrichedPlaylists = playlists.map((playlist) => {
      if (!playlist) return undefined;

      const form = forms.find((form) => form.playlist_id === playlist.id);
      const vote = votes.find((vote) => vote.playlist_id === playlist.id);

      if (!form) return undefined;

      return {
        data: playlist,
        isOpen: !!form.enable_voting,
        hasVoted: !!vote,
        hasCreated: form.created_by === userId,
      };
    });

    return enrichedPlaylists.filter((item) => !!item);
  }

  return {
    playlists: playlistPromise(),
  };
}

function ListPlaylistsFallback() {
  return <Placeholder label="Loading playlists..." loading />;
}

function ListPlaylistsError() {
  return (
    <Placeholder label="Something went wrong when fetching your playlists!" />
  );
}

export default function Index() {
  const { playlists } = useLoaderData<typeof loader>();

  return (
    <div>
      <HeaderHome />
      <Section title="Open Voting Forms">
        <Suspense fallback={<ListPlaylistsFallback />}>
          <Await resolve={playlists} errorElement={<ListPlaylistsError />}>
            <ListPlaylists filter={(playlist) => !!playlist.isOpen} />
          </Await>
        </Suspense>
      </Section>
      <Section title="Closed Voting Forms">
        <Suspense fallback={<ListPlaylistsFallback />}>
          <Await resolve={playlists} errorElement={<ListPlaylistsError />}>
            <ListPlaylists filter={(playlist) => !playlist.isOpen} />
          </Await>
        </Suspense>
      </Section>
    </div>
  );
}
