import { ReactNode } from "react";
import { Link } from "@remix-run/react";

import { SpotifyImage } from "./spotify-image";
import { ActionMenu } from "./action-menu";

type Props = {
  playlist: SpotifyApi.PlaylistObjectFull;
  href?: string;
  cta?: string;
  tags?: (string | false)[];
  actions?: (ReactNode | false)[];
};

export function CardPlaylist({ playlist, href, cta, tags, actions }: Props) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded bg-gray-800">
      <div className="flex">
        <div className="flex min-w-0 grow flex-col justify-center gap-1  p-3">
          <p className="label w-full truncate font-semibold">{playlist.name}</p>
          {!cta || !href ? null : (
            <Link to={href} className="link">
              {cta}
            </Link>
          )}
        </div>
        <SpotifyImage
          image={playlist?.images[0]}
          className="aspect-square w-20 shrink-0 bg-gray-950 object-cover"
        />
      </div>
      <div className="flex items-center justify-between border-t border-gray-900 p-3 text-gray-400">
        <div className="flex items-center gap-1">
          <Link to={playlist.external_urls.spotify} target="_blank">
            <img
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
              className="size-4"
              alt="Spotify Logo"
            />
          </Link>
          <p className="badge rounded-full bg-gray-900 px-2 py-1">
            {playlist.tracks.total ?? 0} tracks
          </p>
          {tags?.map((tag) => {
            if (!tag) return null;
            return (
              <p key={tag} className="badge rounded-full bg-gray-700 px-2 py-1">
                {tag}
              </p>
            );
          })}
        </div>
        {!actions?.length ? null : <ActionMenu items={actions} />}
      </div>
    </div>
  );
}

export function CardPlaylistSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded border border-gray-800">
      <div className="flex">
        <div className="flex min-w-0 grow flex-col justify-center gap-1  p-3">
          <p className="label truncate font-semibold text-gray-600">
            None found
          </p>
        </div>
        <div className="aspect-square w-20 shrink-0 bg-gray-800" />
      </div>
      <div className="flex items-center gap-2 border-t border-gray-800 p-3">
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
          className="size-4 opacity-60"
          alt="Spotify Logo"
        />
        <p className="badge rounded-full bg-gray-800 px-2 py-1 text-gray-600">
          ∞ tracks
        </p>
      </div>
    </div>
  );
}
