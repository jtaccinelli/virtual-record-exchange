import { Link } from "@remix-run/react";
import { SpotifyImage } from "./spotify-image";
import { useMemo } from "react";

type Props = {
  playlist?: SpotifyApi.PlaylistObjectFull;
  hasVoteLink?: boolean;
  hasResultsLink?: boolean;
};

export function CardPlaylist({ playlist, hasVoteLink, hasResultsLink }: Props) {
  const link = useMemo(() => {
    if (!playlist) return undefined;
    if (hasVoteLink) {
      return {
        label: "Go Vote",
        url: `/vote/${playlist.id}`,
      };
    }
    if (hasResultsLink) {
      return {
        label: "See Results",
        url: `/results/${playlist.id}`,
      };
    }
    return undefined;
  }, [playlist]);

  return (
    <div className="flex w-full items-center gap-4 rounded bg-gray-800 p-2">
      <SpotifyImage
        image={playlist?.images[0]}
        className="size-24 shrink-0 rounded bg-gray-900"
      />
      <div className="flex-grow">
        <p className="mb-1 text-sm font-medium text-gray-500">
          {playlist?.tracks.total ?? 0} tracks
        </p>
        {playlist?.name ? (
          <p className="mb-2 w-full max-w-96 truncate text-lg font-bold">
            {playlist.name}
          </p>
        ) : (
          <p className="text-lg text-gray-500">No Playlist</p>
        )}
        <div className="flex justify-between">
          {!link ? null : (
            <Link
              to={link.url}
              className="mb-2 text-sm font-semibold text-primary-600 underline underline-offset-4"
            >
              {link.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
