import { ChangeEvent, useMemo, useRef, useState } from "react";

import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Field,
  Label,
  Description,
} from "@headlessui/react";

import { SpotifyImage } from "./spotify-image";
import { Pill } from "./pill";

type Props = {
  tracks: SpotifyApi.TrackObjectFull[];
  max?: number;
};

export function FieldTracks({ tracks, max = 3 }: Props) {
  const [query, setQuery] = useState<string>();
  const [selectedTracks, setSelectedTracks] = useState<typeof tracks>([]);

  const isAtSelectedMax = useMemo(() => {
    return selectedTracks.length >= max;
  }, [selectedTracks, max]);

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const isSelected = selectedTracks.some((selectedTrack) => {
        return selectedTrack.id === track.id;
      });

      if (isSelected) return false;
      if (!query) return true;

      const formattedQuery = query.toLowerCase();
      const hasNameMatch = track.name.toLowerCase().includes(formattedQuery);

      return hasNameMatch;
    });
  }, [selectedTracks, query]);

  const handleClearTrack = (targetTrack: SpotifyApi.TrackObjectFull) => () => {
    setSelectedTracks((tracks) => {
      return tracks.filter((track) => {
        return track.id !== targetTrack.id;
      });
    });
  };

  const handleClearAll = () => {
    setSelectedTracks([]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <Field className="flex flex-col gap-4 px-6 py-8">
      <div className="mb-1 flex w-full justify-between">
        <Label className="font-medium">
          What were the best tracks submitted this week?
        </Label>
        {selectedTracks.length === 0 ? null : (
          <button
            onClick={handleClearAll}
            className="text-sm font-medium text-primary-600 underline underline-offset-2"
          >
            Clear
          </button>
        )}
      </div>
      <Description className="mb-4 text-sm text-gray-500">
        Select a maximum of {max}
      </Description>

      <div className="mb-6 flex w-full flex-row flex-wrap gap-2">
        {selectedTracks.length === 0 ? (
          <div className="rounded border-2 border-dashed border-gray-700 px-3 py-1 text-sm font-semibold text-gray-700">
            No Tracks Selected
          </div>
        ) : (
          selectedTracks.map((track) => (
            <Pill
              key={track.id}
              onClick={handleClearTrack(track)}
              label={track.name}
            />
          ))
        )}
      </div>

      <Combobox
        multiple
        immediate
        value={selectedTracks}
        onChange={setSelectedTracks}
        name="tracks"
      >
        <input
          type="hidden"
          name="track-ids"
          value={selectedTracks.map((track) => track.id).join(",")}
        />
        <ComboboxInput
          className="field-input"
          onChange={handleInputChange}
          disabled={isAtSelectedMax}
          placeholder={
            isAtSelectedMax
              ? "Max tracks have been selected"
              : "Search for tracks by name..."
          }
        />
        <ComboboxOptions
          anchor="bottom"
          className="max-h-16 w-[--input-width] gap-2 overflow-y-scroll rounded bg-gray-950/80 p-2 backdrop-blur [--anchor-gap:12px] empty:hidden aria-disabled:hidden"
          aria-disabled={isAtSelectedMax}
        >
          {filteredTracks.map((track) => {
            return (
              <ComboboxOption
                key={track.id}
                value={track}
                className="flex items-center gap-2 rounded p-1 hover:cursor-pointer hover:bg-gray-900"
              >
                <SpotifyImage
                  image={track.album?.images?.[0]}
                  className="size-14 rounded bg-gray-950"
                />
                <div className="flex flex-col">
                  <p>{track.name}</p>
                  <p className="text-sm text-gray-500">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
              </ComboboxOption>
            );
          })}
        </ComboboxOptions>
      </Combobox>
    </Field>
  );
}
