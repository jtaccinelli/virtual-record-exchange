import { useMemo } from "react";

import { CardPlaylist, CardPlaylistSkeleton } from "./card-playlist";
import { DialogCloseVoting } from "./dialog-close-voting";
import { DialogDeleteForm } from "./dialog-delete-form";
import { DialogReopenVoting } from "./dialog-reopen-voting";
import { useAsyncValue } from "@remix-run/react";
import { Placeholder } from "./placeholder";

type Props = {
  filter: (playlist: EnrichedPlaylist) => boolean;
};

export function ListPlaylists({ filter }: Props) {
  const playlists = useAsyncValue() as EnrichedPlaylist[];

  const filteredPlaylists = useMemo(
    () => playlists.filter(filter),
    [filter, playlists],
  );

  if (!filteredPlaylists.length) {
    return <Placeholder label="No playlists found" />;
  }

  return filteredPlaylists.map((playlist) => (
    <CardPlaylist
      key={playlist.data.id}
      playlist={playlist.data}
      cta={
        playlist.isOpen
          ? playlist.hasVoted
            ? "Overwrite Your Vote"
            : "Submit Your Vote"
          : "See Results"
      }
      href={
        playlist.isOpen
          ? `/vote/${playlist.data.id}`
          : `/results/${playlist.data.id}`
      }
      tags={[
        !!playlist.hasCreated && "You Made This",
        !!playlist.hasVoted && "Voted",
      ]}
      actions={[
        !!playlist.hasCreated && (
          <DialogDeleteForm
            playlist={playlist.data}
            className="text whitespace-nowrap px-3 py-2 text-left"
          />
        ),
        !!playlist.hasCreated && !!playlist.isOpen && (
          <DialogCloseVoting
            playlist={playlist.data}
            className="text whitespace-nowrap px-3 py-2 text-left"
          />
        ),
        !!playlist.hasCreated && !playlist.isOpen && (
          <DialogReopenVoting
            playlist={playlist.data}
            className="text whitespace-nowrap px-3 py-2 text-left"
          />
        ),
      ]}
    />
  ));
}
