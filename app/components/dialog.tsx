import { ReactNode } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";

type Props = {
  open: boolean;
  children?: ReactNode;
  className?: string;
};

export function Dialog({ open, children, className }: Props) {
  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={clsx(
            "fixed bottom-0 left-1/2",
            "w-full max-w-screen-sm -translate-x-1/2 rounded-t-lg",
            "border-t border-gray-800 bg-gray-900 text-white",
            "focus:outline-none",
            className,
          )}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
