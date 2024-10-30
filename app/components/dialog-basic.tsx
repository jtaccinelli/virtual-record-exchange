import { ReactNode } from "react";

import { Dialog } from "@app/components/dialog";

type Props = {
  open: boolean;
  emoji: string;
  heading: string;
  subheading: string;
  children?: ReactNode;
};

export function DialogBasic({
  open,
  emoji,
  heading,
  subheading,
  children,
}: Props) {
  return (
    <Dialog
      open={open}
      className="flex flex-col items-center p-6 pb-12 pt-16 text-center"
    >
      <span className="mb-6 text-6xl">{emoji}</span>
      <p className="heading mb-1 text-white">{heading}</p>
      <p className="text mb-8 text-gray-400">{subheading}</p>
      <div className="flex gap-2">{children}</div>
    </Dialog>
  );
}
