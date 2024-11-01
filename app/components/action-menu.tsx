import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { ReactNode } from "react";

type Props = {
  items: ReactNode[];
};

export function ActionMenu({ items }: Props) {
  return (
    <div className="group relative">
      <button
        className="-m-3 flex size-11 items-center justify-center"
        tabIndex={0}
      >
        <EllipsisVerticalIcon className="size-5" />
      </button>
      <div
        className="
            pointer-events-none absolute bottom-full right-0 flex min-w-32 flex-col divide-y
          divide-gray-200 rounded bg-white text-black opacity-0 transition-all
            group-focus-within:pointer-events-auto group-focus-within:mb-3 group-focus-within:opacity-100"
      >
        {items.map((item) => {
          if (!item) return null;
          return item;
        })}
      </div>
    </div>
  );
}
