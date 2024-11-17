import { ReactNode } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";

import { useBoolean } from "@app/hooks/use-boolean";
import { useUi } from "@app/hooks/use-ui";

type Props = {
  items: ReactNode[];
};

export function ActionMenu({ items }: Props) {
  const [isOpen, setIsOpen] = useBoolean(false);

  const ui = useUi({
    closed: !isOpen,
  });

  if (items.length === 0) return null;

  return (
    <div className="group relative">
      <button
        className="-m-3 flex size-11 items-center justify-center"
        onClick={setIsOpen.toggle}
      >
        <EllipsisVerticalIcon className="size-5" />
      </button>
      <div
        data-ui={ui}
        className="
          absolute bottom-full right-0 
          mb-3 flex min-w-32 flex-col 
          divide-y divide-gray-200 rounded bg-white text-black transition-all 
          ui-[closed]:pointer-events-none ui-[closed]:mb-0 ui-[closed]:opacity-0"
      >
        {items.map((item) => {
          if (!item) return null;
          return item;
        })}
      </div>
    </div>
  );
}
