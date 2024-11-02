import { ChangeEvent, useMemo, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { loader } from "@app/routes/api.playlist.fetch";

import { CardPlaylist } from "./card-playlist";
import { Alert } from "./alert";
import { Placeholder } from "./placeholder";

const URL_STARTER = "https://open.spotify.com/playlist/";

export function FieldPlaylistInput() {
  const [value, setValue] = useState<string>("");
  const fetcher = useFetcher<typeof loader>();

  const { playlist, contributorIds, hasConfig } = useMemo(() => {
    if (!fetcher.data?.playlist) return {};

    const playlist = fetcher.data.playlist;
    const hasConfig = fetcher.data.hasConfig;
    const contributorIds = playlist.tracks.items
      .reduce<string[]>((array, item) => {
        const hasId = array.some((id) => id === item.added_by.id);
        if (!hasId) array.push(item.added_by.id);
        return array;
      }, [])
      .join(",");

    return {
      playlist,
      hasConfig,
      contributorIds,
    };
  }, [fetcher.data]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!value.startsWith(URL_STARTER)) return;

    setValue(value);
    const id = value.split("?").shift()?.split("/").pop();
    fetcher.load(`/api/playlist/fetch?id=${id}`);
  };

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <input type="hidden" name="playlist-id" value={playlist?.id ?? ""} />
      <input type="hidden" name="contributor-ids" value={contributorIds} />
      <label className="label -mb-4 block">What playlist are we using?</label>
      <div className="flex justify-between">
        <p className="text text-gray-400">Paste in a playlist URL below</p>
        <button
          type="button"
          onClick={handleClear}
          className="link disabled:hidden"
          disabled={!value}
        >
          Clear
        </button>
      </div>
      <input
        type="url"
        placeholder={`${URL_STARTER}...`}
        value={value}
        disabled={!!playlist && !!value}
        onChange={handleChange}
        className="rounded border-transparent bg-gray-700 text-white placeholder:text-gray-500"
      />
      {!value ? (
        <Placeholder label="No URL has been provided" />
      ) : fetcher.state === "loading" ? (
        <Placeholder label="Searching for playlist..." loading />
      ) : !playlist ? (
        <Placeholder label="No playlist found" />
      ) : (
        <CardPlaylist playlist={playlist} />
      )}
      {!hasConfig || !playlist ? null : (
        <Alert
          message="This playlist already has a form created."
          cta="Go Vote"
          href={`/vote/${playlist.id}`}
        />
      )}
    </div>
  );
}
