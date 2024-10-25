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
  users: SpotifyApi.UserProfileResponse[];
  max?: number;
};

export function FieldUsers({ users, max = 1 }: Props) {
  const [query, setQuery] = useState<string>();
  const [selectedUsers, setSelectedUsers] = useState<typeof users>([]);

  const isAtSelectedMax = useMemo(() => {
    return selectedUsers.length >= max;
  }, [selectedUsers, max]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const isSelected = selectedUsers.some((selectedUser) => {
        return selectedUser.id === user.id;
      });

      if (isSelected) return false;
      if (!query) return true;

      const formattedQuery = query.toLowerCase();
      const displayName = user?.display_name ?? user.id;

      const hasNameMatch = displayName.toLowerCase().includes(formattedQuery);
      const hasIdMatch = user.id.toLowerCase().includes(formattedQuery);

      return hasNameMatch || hasIdMatch;
    });
  }, [selectedUsers, query]);

  const handleClearUser =
    (targetUser: SpotifyApi.UserProfileResponse) => () => {
      setSelectedUsers((users) => {
        return users.filter((user) => {
          return user.id !== targetUser.id;
        });
      });
    };

  const handleClearAll = () => {
    setSelectedUsers([]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <Field className="flex flex-col">
      <div className="mb-1 flex w-full justify-between">
        <Label className="font-medium">
          Who submitted the best tracks this week?
        </Label>
        {selectedUsers.length === 0 ? null : (
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

      <div className="mb-4 flex w-full flex-row flex-wrap gap-2">
        {selectedUsers.length === 0 ? (
          <div className="rounded border-2 border-dashed border-gray-700 px-3 py-1 text-sm font-semibold text-gray-700">
            No User Selected
          </div>
        ) : (
          selectedUsers.map((user) => (
            <Pill
              key={user.id}
              onClick={handleClearUser(user)}
              label={user.display_name ?? user.id}
            />
          ))
        )}
      </div>

      <Combobox
        multiple
        immediate
        value={selectedUsers}
        onChange={setSelectedUsers}
        name="users"
      >
        <ComboboxInput
          className="field-input"
          onChange={handleInputChange}
          disabled={isAtSelectedMax}
          placeholder={
            isAtSelectedMax
              ? "Max users have been selected"
              : "Search for users..."
          }
        />
        <ComboboxOptions
          anchor="bottom"
          className="max-h-16 w-[--input-width] gap-2 overflow-y-scroll rounded bg-gray-950/80 p-2 backdrop-blur-lg [--anchor-gap:16px] empty:hidden aria-disabled:hidden"
          aria-disabled={isAtSelectedMax}
        >
          {filteredUsers.map((user) => {
            return (
              <ComboboxOption
                key={user.id}
                value={user}
                className="flex items-center gap-2 rounded p-1 hover:cursor-pointer hover:bg-gray-900"
              >
                <SpotifyImage
                  image={user.images?.[0]}
                  className="size-8 rounded bg-gray-950"
                />
                {user.display_name}
              </ComboboxOption>
            );
          })}
        </ComboboxOptions>
      </Combobox>
    </Field>
  );
}
