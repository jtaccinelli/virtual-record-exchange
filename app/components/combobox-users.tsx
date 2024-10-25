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

type Props = {
  users: SpotifyApi.UserProfileResponse[];
  max?: number;
};

export function ComboboxUsers({ users, max = 1 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleDisplayUser = (user: SpotifyApi.UserProfileResponse) => {
    return user?.display_name ?? user.id;
  };

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
    inputRef.current?.blur();
  };

  return (
    <Field className="flex flex-col">
      <div className="flex w-full justify-between">
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
      <Description className="mb-2 text-gray-500">
        Select a maximum of {max}
      </Description>

      <div className="mb-4 flex w-full flex-row flex-wrap gap-1">
        {selectedUsers.length === 0 ? (
          <div className="rounded-full border-2 border-dashed border-gray-600 px-3 py-1 text-sm font-medium text-gray-600">
            No User Selected
          </div>
        ) : (
          selectedUsers.map((user) => {
            return (
              <button
                key={user.id}
                onClick={handleClearUser(user)}
                className="rounded-full border-2 border-transparent bg-primary-700 px-3 py-1 text-sm font-medium text-gray-300"
              >
                {user.display_name}
              </button>
            );
          })
        )}
      </div>

      <Combobox
        multiple
        immediate
        value={selectedUsers}
        onChange={setSelectedUsers}
      >
        <ComboboxInput
          ref={inputRef}
          displayValue={handleDisplayUser}
          className="rounded border-2 border-gray-600 bg-gray-800 p-3 placeholder:text-gray-400 disabled:border-transparent disabled:placeholder:text-gray-600"
          onChange={handleInputChange}
          disabled={isAtSelectedMax}
          placeholder="Search for users..."
        />
        <ComboboxOptions
          anchor="bottom"
          className="max-h-16 w-[--input-width] gap-2 overflow-y-scroll rounded bg-gray-800/60 p-2 backdrop-blur [--anchor-gap:12px] empty:hidden aria-disabled:hidden"
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
