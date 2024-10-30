import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link, useFetcher } from "@remix-run/react";
import { InformationCircleIcon } from "@heroicons/react/16/solid";

import { loader } from "@app/routes/api.playlist.fetch";
import { CardPlaylist, CardPlaylistSkeleton } from "./card-playlist";
import { Alert } from "./alert";

const URL_STARTER = "https://open.spotify.com/playlist/";

export function FieldPlaylistInput() {
  const [playlistUrl, setPlaylistUrl] = useState<string>("");
  const [playlistId, setPlaylistId] = useState<string>("");

  const fetcher = useFetcher<typeof loader>();

  useEffect(() => {
    if (!playlistId) return;
    fetcher.load(`/api/playlist/fetch?id=${playlistId}`);
  }, [playlistId]);

  const playlist = useMemo(() => {
    return fetcher.data?.playlist;
  }, [fetcher.data]);

  const contributorIds = useMemo(() => {
    if (!fetcher.data?.playlist) return [];

    const [...userIds] = new Set(
      fetcher.data.playlist.tracks.items.map((item) => {
        return item.added_by.id;
      }),
    );

    return userIds;
  }, [fetcher.data]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value.startsWith("https://open.spotify.com/playlist/")) return;
    const id = value.split("?").shift()?.split("/").pop();
    setPlaylistId(id ?? "");
    setPlaylistUrl(value);
  };

  const handleClear = () => {
    setPlaylistId("");
    setPlaylistUrl("");
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <input type="hidden" name="playlist-id" value={playlistId} />
      <input type="hidden" name="contributor-ids" value={contributorIds} />
      <label className="label -mb-4 block">What playlist are we using?</label>
      <div className="flex justify-between">
        <p className="text text-gray-400">Paste in a playlist URL below</p>
        <button
          type="button"
          onClick={handleClear}
          className="link disabled:hidden"
          disabled={!playlistId}
        >
          Clear
        </button>
      </div>
      <input
        type="url"
        placeholder={`${URL_STARTER}...`}
        value={playlistUrl}
        disabled={!!playlistId}
        onChange={handleChange}
        className="rounded border-transparent bg-gray-700 text-white placeholder:text-gray-500"
      />
      {!playlist ? (
        <CardPlaylistSkeleton />
      ) : (
        <CardPlaylist playlist={playlist} />
      )}
      {!fetcher.data?.hasConfig ? null : (
        <Alert
          message="This playlist already has a form created."
          cta="Go Vote"
          href={`/vote/${playlistId}`}
        />
      )}
    </div>
  );
}
