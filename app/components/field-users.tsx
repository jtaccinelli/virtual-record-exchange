import { useCallback, useMemo, useState } from "react";
import { Link } from "@remix-run/react";

import { SpotifyImage } from "./spotify-image";
import { Pill } from "./pill";
import { DialogSearch } from "./dialog-search";

type Props = {
  users: User[];
  max?: number;
};

export function FieldUsers({ users, max = 1 }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const isAtSelectedMax = useMemo(() => {
    return selectedUsers.length >= max;
  }, [selectedUsers, max]);

  const handleFilter = (item: User, query: string) => {
    if (!query) return true;
    const term = query.toLowerCase();
    const displayName = item?.display_name ?? item.id;

    const hasNameMatch = displayName.toLowerCase().includes(term);
    const hasIdMatch = item.id.toLowerCase().includes(term);

    return hasNameMatch || hasIdMatch;
  };

  const handleSelectUser = (item: User) => () => {
    setSelectedUsers((users) => {
      return [...users, item];
    });
  };

  const handleClearUser = (item: User) => () => {
    setSelectedUsers((users) => {
      return users.filter((user) => {
        return user.id !== item.id;
      });
    });
  };

  const handleClearAll = () => {
    setSelectedUsers([]);
  };

  const handleToggleTrack = (item: User) => () => {
    const isSelected = selectedUsers.some((user) => item.id === user.id);
    if (isSelected) handleClearUser(item)();
    else handleSelectUser(item)();
  };

  const renderUser = useCallback(
    (item: User) => {
      const isSelected = selectedUsers.some((user) => item.id === user.id);
      return (
        <button
          type="button"
          data-ui={isSelected && "selected"}
          className="group flex items-center overflow-hidden rounded bg-gray-800 transition-all hover:cursor-pointer hover:bg-gray-700 ui-[selected]:bg-white"
          onClick={handleToggleTrack(item)}
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
    },
    [selectedUsers],
  );

  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <input
        type="hidden"
        name="user-ids"
        value={selectedUsers.map((user) => user.id).join(",")}
      />
      <label className="label -mb-4 block">
        Who submitted the best tracks this week?
      </label>
      <p className="text text-gray-400">Select a maximum of {max}</p>
      <div className="flex items-end justify-between">
        <div className="flex grow flex-wrap items-center gap-2">
          {selectedUsers.length === 0 ? (
            <p className="text flex items-center gap-1 whitespace-nowrap rounded border border-gray-600 px-3 py-1 text-gray-600">
              No Users Selected
            </p>
          ) : (
            selectedUsers.map((user) => (
              <Pill
                key={user.id}
                onClick={handleClearUser(user)}
                label={user?.display_name ?? user.id}
              />
            ))
          )}
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          className="link disabled:hidden"
          disabled={!selectedUsers.length}
        >
          Clear
        </button>
      </div>
      <DialogSearch
        cta="Add your users..."
        label="Search Users"
        placeholder="Search for users by name..."
        items={users}
        filter={handleFilter}
        renderItem={renderUser}
        disabled={isAtSelectedMax}
      />
    </div>
  );
}
