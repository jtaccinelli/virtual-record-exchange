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
    <DialogRoot open={open} onClose={onClose}>
      <DialogBackdrop className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" />
      <DialogPanel
        className={clsx(
          "fixed bottom-0 left-1/2",
          "w-full max-w-screen-sm -translate-x-1/2 rounded-t-lg",
          "border-t border-gray-800 bg-gray-900 text-white",
          "focus:outline-none",
          className,
        )}
      >
        {children}
      </DialogPanel>
    </DialogRoot>
  );
}
