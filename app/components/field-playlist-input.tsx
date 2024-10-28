import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link, useFetcher } from "@remix-run/react";
import { Description, Field, Input, Label } from "@headlessui/react";

import { loader } from "@app/routes/api.playlist.fetch";
import { CardPlaylist } from "./card-playlist";

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

  const handleClearInput = () => {
    setPlaylistId("");
    setPlaylistUrl("");
  };

  return (
    <Field className="flex flex-col">
      <div className="flex items-center justify-between">
        <Label className="mb-1 font-medium">What playlist are we using?</Label>
        {!playlistId ? null : (
          <button
            onClick={handleClearInput}
            className="text-sm font-medium text-primary-600 underline underline-offset-2"
          >
            Clear
          </button>
        )}
      </div>
      <Description className="mb-4 text-sm text-gray-500">
        Paste in a playlist URL below
      </Description>
      <input type="hidden" name="playlist-id" value={playlistId} />
      <input type="hidden" name="contributor-ids" value={contributorIds} />
      <Input
        className="field-input mb-4"
        placeholder={`${URL_STARTER}...`}
        value={playlistUrl}
        disabled={!!playlistId}
        onChange={handleChange}
      />
      <CardPlaylist playlist={playlist} />
      {!fetcher.data?.hasConfig ? null : (
        <div className="mt-2 flex justify-between rounded bg-primary-950 p-4">
          <p>This playlist already has a form created.</p>
          <Link
            to={`/vote/${playlistId}`}
            className="text-primary-600 underline underline-offset-2"
          >
            Go There
          </Link>
        </div>
      )}
    </Field>
  );
}
