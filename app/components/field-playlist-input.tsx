import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Description, Field, Input, Label } from "@headlessui/react";

import { loader } from "@app/routes/api.playlist.fetch";
import { SpotifyImage } from "./spotify-image";

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
      <input type="hidden" name="playlistId" value={playlistId} />
      <Input
        className="field-input mb-4"
        placeholder="https://open.spotify.com/playlist/..."
        value={playlistUrl}
        disabled={!!playlistId}
        onChange={handleChange}
      />
      {!playlistId ? null : !playlist ? null : (
        <div className="flex items-center gap-4 rounded border-2 border-gray-800 bg-gray-900 p-2">
          <SpotifyImage image={playlist.images[0]} className="size-20" />
          <div>
            <p className="text-lg font-bold">{playlist.name}</p>
            <p className="mb-1 text-sm font-medium text-gray-500">
              {playlist.tracks.total} tracks
            </p>
          </div>
        </div>
      )}
    </Field>
  );
}
