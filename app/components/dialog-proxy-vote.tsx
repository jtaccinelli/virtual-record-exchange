import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";

import { SpotifyImage } from "./spotify-image";
import { DialogSearch } from "./dialog-search";

type Props = {
  users: User[];
  playlist: Playlist;
  className?: string;
};

export function DialogProxyVote({ users, playlist, className }: Props) {
  const navigate = useNavigate();

  const handleFilter = (item: User, query: string) => {
    if (!query) return true;
    const term = query.toLowerCase();
    const displayName = item?.display_name ?? item.id;

    const hasNameMatch = displayName.toLowerCase().includes(term);
    const hasIdMatch = item.id.toLowerCase().includes(term);

    return hasNameMatch || hasIdMatch;
  };

  const handleNavigate = (user: User) => () => {
    navigate(`/vote/${playlist.id}?user=${user.id}`);
  };

  const renderUser = useCallback((item: User) => {
    return (
      <button
        type="button"
        className="group flex items-center overflow-hidden rounded bg-gray-800 transition-all hover:cursor-pointer hover:bg-gray-700"
        onClick={handleNavigate(item)}
      >
        <SpotifyImage
          image={item.images?.[0]}
          className="size-12 bg-gray-950"
        />
        <div className="flex min-w-0 grow flex-col px-3 py-2 text-left">
          <p className="label group-ui-[selected]:text-black">
            {item?.display_name ?? item.id}
          </p>
        </div>
        <Link
          to={item.external_urls.spotify}
          target="_blank"
          className="flex size-12 shrink-0 items-center justify-center"
        >
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
            className="size-4"
            alt="Spotify Logo"
          />
        </Link>
      </button>
    );
  }, []);

  return (
    <DialogSearch
      cta="Vote on behalf of..."
      label="Search Users"
      placeholder="Search for users by name..."
      className={className}
      items={users}
      filter={handleFilter}
      renderItem={renderUser}
    />
  );
}
