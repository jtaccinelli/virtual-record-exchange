import { Link } from "@remix-run/react";
import { SpotifyImage } from "./spotify-image";
import { useMemo } from "react";

type Props = {
  playlist?: SpotifyApi.PlaylistObjectFull;
  hasVoteLink?: boolean;
  hasResultsLink?: boolean;
};

export function CardPlaylist({ playlist, hasVoteLink, hasResultsLink }: Props) {
  if (!playlist)
    return (
      <div className="flex w-full items-end overflow-hidden rounded border border-gray-800">
        <div className="aspect-square w-28 shrink-0 border-r border-gray-800" />
        <div className="flex min-w-0 grow flex-col self-stretch">
          <div className="flex grow items-center p-3">
            <p className="label truncate font-semibold text-gray-600">
              None found
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-between border-t border-gray-800 p-3">
            <div className="flex items-center gap-2 text-gray-600">
              <p className="text">∞ tracks</p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex w-full items-end overflow-hidden rounded bg-gray-800">
      <SpotifyImage
        image={playlist?.images[0]}
        className="aspect-square w-28 shrink-0 bg-gray-950"
      />
      <div className="flex min-w-0 grow flex-col self-stretch">
        <div className="flex grow items-center p-3">
          <p className="label truncate font-semibold">{playlist.name}</p>
        </div>
        <div className="flex shrink-0 items-center justify-between border-t border-gray-900 p-3">
          {!hasVoteLink ? null : (
            <Link to={`/vote/${playlist.id}`} className="link">
              Go Vote
            </Link>
          )}
          {!hasResultsLink ? null : (
            <Link to={`/results/${playlist.id}`} className="link">
              See Results
            </Link>
          )}
          <div className="flex items-center gap-2 text-gray-400">
            <p className="text">{playlist?.tracks.total ?? 0} tracks</p>
            <span>•</span>
            <Link to={playlist.external_urls.spotify} target="_blank">
              <img
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
                className="size-4"
                alt="Spotify Logo"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
