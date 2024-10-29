import { useMemo } from "react";
import { CardPlaylist } from "./card-playlist";

type Props = {
  title: string;
  ids: string[];
  playlists: SpotifyApi.PlaylistObjectFull[];
  hasVoteLink?: boolean;
  hasResultsLink?: boolean;
};

export function ListPlaylists({
  ids,
  playlists,
  title,
  hasVoteLink,
  hasResultsLink,
}: Props) {
  const filteredPlaylists = useMemo(() => {
    return playlists.filter((playlist) => {
      return ids.some((id) => id === playlist.id);
    });
  }, [ids, playlists]);

  return (
    <div className="flex flex-col">
      <p className="sticky top-0 border-b-2 border-gray-800 bg-gray-900 p-4 text-lg font-medium">
        {title}
      </p>
      <div className="flex flex-col gap-4 p-4">
        {filteredPlaylists.length === 0 ? (
          <CardPlaylist />
        ) : (
          filteredPlaylists.map((playlist) => {
            return (
              <CardPlaylist
                key={playlist.id}
                playlist={playlist}
                hasVoteLink={hasVoteLink}
                hasResultsLink={hasResultsLink}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
