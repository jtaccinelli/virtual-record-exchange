import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";

import { useBoolean } from "@app/hooks/use-boolean";
import { Dialog } from "./dialog";

type Props<Item> = {
  label: string;
  cta: string;
  placeholder: string;
  disabled?: boolean;
  items: Item[];
  renderItem: (item: Item) => ReactNode;
  filter: (item: Item, query: string) => boolean;
  className?: string;
};

export function DialogSearch<Item>({
  label,
  cta,
  placeholder,
  disabled,
  items,
  filter,
  renderItem,
  className,
}: Props<Item>) {
  const [isOpen, setIsOpen] = useBoolean(false);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return filter(item, query);
    });
  }, [items, query]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery("");
  };

  useEffect(() => {
    if (disabled) setIsOpen.false();
  }, [disabled]);

  return (
    <>
      <button
        type="button"
        onClick={setIsOpen.true}
        className={className}
        disabled={disabled}
      >
        {cta}
      </button>
      <Dialog open={isOpen} onClose={setIsOpen.false} className="flex flex-col">
        <div className="flex h-full flex-col gap-3 p-6 text-white">
          <label className="label">{label}</label>
          <div className="sticky top-6 flex h-11 w-full rounded bg-gray-700 text-white">
            <input
              name="query"
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder={placeholder}
              disabled={disabled}
              className="grow rounded border-transparent bg-transparent placeholder:text-gray-500"
            />
            <button
              className="group flex size-11 items-center justify-center"
              onClick={handleClear}
              disabled={!query}
            >
              <MagnifyingGlassIcon className="hidden size-4 group-disabled:block" />
              <XMarkIcon className="size-4 group-disabled:hidden" />
            </button>
          </div>
          {!filteredItems.length ? (
            <div className="text flex items-center justify-center rounded border border-gray-600 p-4 text-gray-600">
              No Results Found
            </div>
          ) : (
            filteredItems.map((item) => renderItem(item))
          )}
        </div>
      </Dialog>
    </>
  );
}
