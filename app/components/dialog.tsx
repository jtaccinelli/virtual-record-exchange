import { ReactNode } from "react";
import {
  Dialog as DialogRoot,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import clsx from "clsx";

type Props = {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onClose = () => {},
  children,
  className,
}: Props) {
  return (
    <DialogRoot
      open={open}
      onClose={onClose}
      transition
      className="group transition-all data-[closed]:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-950/60 backdrop-blur-lg" />
      <DialogPanel
        className={clsx(
          "fixed bottom-0 left-1/2",
          "max-h-[80vh] w-full max-w-screen-sm -translate-x-1/2 overflow-y-scroll rounded-t-xl",
          "bg-gray-900 text-white transition-all",
          "focus:outline-none",
          "group-data-[closed]:translate-y-1/2",
          className,
        )}
      >
        {children}
      </DialogPanel>
    </DialogRoot>
  );
}
