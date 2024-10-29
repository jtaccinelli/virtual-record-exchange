import { ReactNode, useState } from "react";

import { DialogBasic } from "./dialog-basic";

type Props = {
  label: string;
  emoji: string;
  heading: string;
  subheading: string;
  children?: ReactNode;
  className?: string;
};

export function DialogConfirm({
  label,
  emoji,
  heading,
  subheading,
  className,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button onClick={handleOpen} className={className}>
        {label}
      </button>
      <DialogBasic
        open={isOpen}
        emoji={emoji}
        heading={heading}
        subheading={subheading}
      >
        {children}
        <button onClick={handleClose} className="btn btn-secondary">
          Cancel
        </button>
      </DialogBasic>
    </>
  );
}
