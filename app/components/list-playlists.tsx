import { useMemo } from "react";
import { CardPlaylist, CardPlaylistSkeleton } from "./card-playlist";
import { configs } from "context/database";
import { DialogCloseVoting } from "./dialog-close-voting";
import { DialogDeleteForm } from "./dialog-delete-form";
import { DialogReopenVoting } from "./dialog-reopen-voting";

type Props = {
  title: string;
  filter: (playlist: EnrichedPlaylist) => boolean;
  playlists: EnrichedPlaylist[];
};

export function ListPlaylists({ playlists, filter, title }: Props) {
  const filteredPlaylists = useMemo(() => {
    return playlists.filter(filter);
  }, [filter, playlists]);

  return (
    <div className="flex flex-col pb-10">
      <p className="label sticky top-0 border-t border-gray-800 bg-gray-900 p-6">
        {title}
      </p>
      <div className="flex flex-col gap-4 px-6 pt-2">
        {!filteredPlaylists.length ? (
          <CardPlaylistSkeleton />
        ) : (
          filteredPlaylists.map((playlist) => (
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
                playlist.hasCreated && "You Made This",
                playlist.hasVoted && "Voted",
              ]}
              actions={[
                playlist.hasCreated && (
                  <DialogDeleteForm
                    playlist={playlist.data}
                    className="text whitespace-nowrap px-3 py-2 text-left"
                  />
                ),
                playlist.hasCreated && playlist.isOpen && (
                  <DialogCloseVoting
                    playlist={playlist.data}
                    className="text whitespace-nowrap px-3 py-2 text-left"
                  />
                ),
                playlist.hasCreated && !playlist.isOpen && (
                  <DialogReopenVoting
                    playlist={playlist.data}
                    className="text whitespace-nowrap px-3 py-2 text-left"
                  />
                ),
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
}
