import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Description, Field, Input, Label } from "@headlessui/react";

import { loader } from "@app/routes/api.playlist.fetch";
import { CardPlaylist } from "./card-playlist";

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
    const id = value.split("?").shift()?.split("/").pop();
    setPlaylistId(id ?? "");
    setPlaylistUrl(value);
  };

  const handleClearInput = () => {
    setPlaylistId("undefined");
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
        placeholder="https://open.spotify.com/playlist/..."
        value={playlistUrl}
        disabled={!!playlistId}
        onChange={handleChange}
      />
      <CardPlaylist playlist={playlist} />
    </Field>
  );
}
